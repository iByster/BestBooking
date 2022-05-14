import jsdom, { JSDOM } from 'jsdom';
import got from 'got';
import { WorkerPayload } from '../types';
const { parentPort, isMainThread } = require('worker_threads');

const main = async (url: string) => {
  if (isMainThread) {
    throw new Error('Its not a worker');
  }

  const virtualConsole = new jsdom.VirtualConsole();

  const response = await got(url);

  const dom = new JSDOM(response.body, { virtualConsole });

  const node = dom.window.document.title;

  parentPort.postMessage({ title: node });
};

parentPort.on('message', (data: WorkerPayload) => {
  console.log(data);
  const { url } = data;
  main(url);
});
