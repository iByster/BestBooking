const { GET_TYPE_TITLE } = require('../../src/consts');

const locationSelector = {
  getType: GET_TYPE_TITLE,
  query: 'title',
  invalidCodeValue: '',
  itemCount: 0,
};

const LOCATION_DECODE_ESKY_DOCUMENT = 'location_decode_esky_document';

const URL = 'https://www.esky.ro/';

const CONTENT_ROUTE = 'hot/search'

const defaultQueryObject = {
  id: 'arrivalCode',
  args: {
    arrivalCode: 1,
    arrivalType: 'city',
    rangeStartDate: '2022-04-23',
    rangeEndDate: '2022-04-23',
    isFlexSearch: false,
    stayLength: '4,4',
    arrivalLat: 46.35,
    arrivalLon: 25.8,
    token: 'ecf7911a-21f2-43a9-83ed-a2a6d7966781',
  },
};

const codeInterval = [10000, 1000000];
// const codeInterval = [10000, 10005];

module.exports = {
  locationSelector,
  defaultQueryObject,
  LOCATION_DECODE_ESKY_DOCUMENT,
  URL,
  CONTENT_ROUTE,
  codeInterval
};
