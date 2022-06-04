import jsdom, { JSDOM } from 'jsdom';
import got from 'got';
import { IUserInput } from '../types';
import fs from 'fs';
import path from 'path';

const runDOMJsWorker = async (userInput: IUserInput, decodedURL: string, conf: any, content?: string) => {
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
  
    await conf.extractData(userInput, document, decodedURL);

    return;
};

export default runDOMJsWorker;