import { ISearchQueryParameters, IUserInput } from '../types';

export const buildUrlForScrape = (
  userInput: IUserInput,
  searchQueryParams: ISearchQueryParameters,
  locationDecoderUrl: URL,
  parseDate: any
) => {
  Object.keys(searchQueryParams).forEach((argKey) => {
    if (argKey === 'checkIn' || argKey === 'checkOut') {
      locationDecoderUrl.searchParams.set(
        searchQueryParams[argKey as keyof ISearchQueryParameters],
        parseDate(userInput[argKey as keyof IUserInput])
      );
    } else {
      locationDecoderUrl.searchParams.set(
        searchQueryParams[argKey as keyof ISearchQueryParameters],
        userInput[argKey as keyof IUserInput].toString()
      );
    }
  });

  return locationDecoderUrl;
};
