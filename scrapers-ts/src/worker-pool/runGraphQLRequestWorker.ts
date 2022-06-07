import axios from 'axios';
import { IScraperConfiguration, IUserInput } from '../types';
import delay from '../utils/delay';
import rotateUserAgent from '../utils/rotateUserAgent';
import fs from 'fs';
import path from 'path';
import { RequestConfiguration } from '../entities/RequestConfiguration';
import { PAGE_THRESHOLD } from '../consts';

const runGraphQLRequestWorker = async (
  userInput: IUserInput,
  decodedURL: string,
  conf: any,
  requestConfiguration: RequestConfiguration  | null,
  scraperConf: IScraperConfiguration,
  page?: number
) => {
  const decodeURLObj = new URL(decodedURL);

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

    const { payload, headers, requestURL, method } = requestConfiguration;

    let pageNumber = page || scraperConf.initialPaginationValue;
    let pagesContor = 0;
    let isMore = false;

    let response = await axios({
      url: requestURL,
      method,
      data: payload,
      headers: headers,
      //! proxy: {}
    });

    let responseData = response.data;

    let pageItems = []
    let hotels = [];

    do {
      pageItems = await conf.extractData(responseData, userInput, decodedURL);

      if (pageItems.length > 0) {
        hotels.push(pageItems);
      }

      pageNumber += scraperConf.pageItemCount;
      pagesContor += 1;
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
    } while (pageItems.length > 0 && pagesContor !== PAGE_THRESHOLD);

    if (pageItems.length > 0) {
      isMore = true;
    }

    return {
      isMore,
      payload: hotels.flat(),
    };
  } else {
    throw new Error('configuration not found');
  }
};

export default runGraphQLRequestWorker;
