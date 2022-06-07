const { parentPort, isMainThread } = require('worker_threads');
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
  console.log('entered worker');

  const { decodedURL, origin, userInput, page, scraperConf, requestConfiguration } = data;

  const confPath = extractConfiguration(origin);
  let conf = null;

  if (confPath) {
    conf = await import(confPath);
  } else {
    console.error('no configuration path was found!');
  }

  let res = null;

  if (conf) {
    if (scraperConf.workerType === 'Puppeteer') {
      res = await runPuppeteerWorker(userInput, decodedURL, conf, scraperConf, page);
    } else if (scraperConf.workerType === 'RequestGraphQL') {
      res = await runGraphQLRequestWorker(userInput, decodedURL, conf, requestConfiguration, scraperConf, page);
    } else if (scraperConf.workerType === 'RequestREST') {
      res = await runRESTRequestWorker(userInput, decodedURL, conf, requestConfiguration, scraperConf, page);
    } else {
      res = await runDOMJsWorker(userInput, decodedURL, conf, scraperConf, page);
    }
  } else {
    console.log('No configuration was found');
  }

  parentPort.postMessage(res);
});
