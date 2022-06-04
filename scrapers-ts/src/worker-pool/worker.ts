const { parentPort, isMainThread } = require('worker_threads');
import DropPoint from '../type-orm.config';
import { WorkerPayload } from '../types';
import runDOMJsWorker from './runDOMJsWorker';
import runGraphQLRequestWorker from './runGraphQLRequestWorker';
import runPuppeteerWorker from './runPuppeteerWorker';
import path from 'path';
import runRESTRequestWorker from './runRESTRequestWorker';

if (isMainThread) {
  throw new Error('Its not a worker');
}

const configurationsPaths = [
  path.join(__dirname, '..', 'configurations', 'agoda.com', 'conf.js'),
  path.join(__dirname, '..', 'configurations', 'esky.ro', 'conf.js'),
  path.join(__dirname, '..', 'configurations', 'hotels.com', 'conf.js'),
  path.join(__dirname, '..', 'configurations', 'trip.com', 'conf.js'),
  path.join(__dirname, '..', 'configurations', 'booking.com', 'conf.js'),
];

const extractConfiguration = (origin: string) => {
  return configurationsPaths.find((c) => {
    const folderThree = c.split('\\');
    const configurationFolderName = folderThree[folderThree.length - 2];

    return origin.includes(configurationFolderName);
  });
};

parentPort.on('message', async (data: WorkerPayload) => {
  await DropPoint.initialize();
  const { decodedURL, origin, userInput } = data;

  const confPath = extractConfiguration(origin);
  let scraperConf = null,
    conf = null;
  if (confPath) {
    conf = await import(confPath);
    scraperConf = conf.scraperConf;
  } else {
    console.error('no configuration path was found!');
  }

  let res = null;

  if (conf) {
    if (scraperConf.workerType === 'Puppeteer') {
      res = await runPuppeteerWorker(userInput, decodedURL, conf);
    } else if (scraperConf.workerType === 'RequestGraphQL') {
      res = await runGraphQLRequestWorker(userInput, decodedURL, conf);
    } else if (scraperConf.workerType === 'RequestREST') {
      res = await runRESTRequestWorker(userInput, decodedURL, conf);
    } else {
      res = await runDOMJsWorker(userInput, decodedURL, conf);
    }
  } else {
    console.log('No configuration was found');
  }

  console.log('here');
  parentPort.postMessage({ title: decodedURL });
});
