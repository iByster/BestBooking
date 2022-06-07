import jsdom, { JSDOM } from 'jsdom';
import got from 'got';
import { IScraperConfiguration, IUserInput } from '../types';
import fs from 'fs';
import path from 'path';

const runDOMJsWorker = async (
  userInput: IUserInput,
  decodedURL: string,
  conf: any,
  scraperConf: IScraperConfiguration,
  page?: number,
  content?: string
) => {
  let html = null;

  if (content) {
    html = content;
    fs.writeFileSync(path.join(__dirname, 'content2.html'), content);
  } else {
    html = (await got(decodedURL)).body;
  }

  const virtualConsole = new jsdom.VirtualConsole();

  const dom = new JSDOM(html, { virtualConsole });

  const document = dom.window.document;

  const res = await conf.extractData(userInput, document, decodedURL);

  return res;
};

export default runDOMJsWorker;
