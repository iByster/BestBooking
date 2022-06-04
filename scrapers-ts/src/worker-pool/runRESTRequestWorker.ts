import axios, { AxiosRequestConfig } from 'axios';
import { IScraperConfiguration, IUserInput } from '../types';
import RequestConfigurationService from '../services/RequestConfigurationService';
import delay from '../utils/delay';
import rotateUserAgent from '../utils/rotateUserAgent';

const runRESTRequestWorker = async (
  userInput: IUserInput,
  decodedURL: string,
  conf: any
) => {
  const requestConfigurationService = new RequestConfigurationService();

  const decodeURLObj = new URL(decodedURL);

  const scraperConf = conf.scraperConf as IScraperConfiguration;

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


    if (scraperConf.query) {
       decodedURL = conf.buildURL(userInput, decodedURL);
    }

    // TODO rotate referer
    requestConfiguration.headers = rotateUserAgent(
      requestConfiguration.headers
    );

    const { apiType, payload, headers, queryParams, requestURL, method } =
      requestConfiguration;

    let pageNumber = 1;

    const axiosRequestConfig: AxiosRequestConfig = {
      url: scraperConf.decodedURLQueryParams ? decodedURL : requestURL,
      headers,
    };

    let response = await axios({
      url: requestURL,
      method,
      headers: headers,
      data: payload,
      //! proxy: {}
    });

    let responseData = response.data;

    while (await conf.extractData(responseData, userInput, decodedURL)) {
      pageNumber += 1;
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
    console.log('configuration not found');
    return;
  }
};

export default runRESTRequestWorker;
