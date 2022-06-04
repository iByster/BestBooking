import axios from 'axios';
import { IScraperConfiguration, IUserInput } from '../types';
import RequestConfigurationService from '../services/RequestConfigurationService';
import delay from '../utils/delay';
import rotateUserAgent from '../utils/rotateUserAgent';
import fs from 'fs';
import path from 'path';

const runGraphQLRequestWorker = async (
  userInput: IUserInput,
  decodedURL: string,
  conf: any
) => {
  const requestConfigurationService = new RequestConfigurationService();
  const scraperConf = conf.scraperConf as IScraperConfiguration;

  const decodeURLObj = new URL(decodedURL);

  const requestConfiguration =
    await requestConfigurationService.getRequestConfigurationByDomain(
      decodeURLObj.origin
    );

  if (requestConfiguration) {
    if (scraperConf.payload) {
      requestConfiguration.payload = conf.buildPayload(
        userInput,
        requestConfiguration.payload,
        decodedURL
      );
    }

    if (scraperConf.decodedURLQueryParams) {
      const builtURL = conf.buildURL(userInput, decodeURLObj) as URL;
      requestConfiguration.requestURL += builtURL.search;
    }

    // TODO rotate referer
    requestConfiguration.headers = rotateUserAgent(
      requestConfiguration.headers
    );


    const { payload, headers, requestURL, method } =
      requestConfiguration;


    let pageNumber = scraperConf.initialPaginationValue;

    // fs.writeFileSync(path.join(__dirname, 'response.json'), JSON.stringify(ceva));
    fs.writeFileSync(path.join(__dirname, 'payload.json'), JSON.stringify(payload));
    fs.writeFileSync(path.join(__dirname, 'headers.json'), JSON.stringify(headers));


    let response = await axios({
      url: requestURL,
      method,
      data: payload,
      headers: headers,
      //! proxy: {}
    });
    

    let responseData = response.data;


    while (await conf.extractData(responseData, userInput, decodedURL)) {
      pageNumber += scraperConf.pageItemCount;
      requestConfiguration.payload = conf.paginate(
        requestConfiguration.payload,
        pageNumber
      );

      await delay(1200);
      response = await axios({
        url: requestURL,
        method,
        headers: headers,
        data: payload,
        //! proxy: {}
      });
      responseData = response.data;
    }

    return;
  } else {
    throw new Error('configuration not found');
  }
};

export default runGraphQLRequestWorker;
