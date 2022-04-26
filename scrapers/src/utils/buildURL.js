const _ = require('lodash');

const buildURL = (baseURL, route = '', queryObject = {}) => {
    let url = `${baseURL}`;

    if (route) {
        if (url.slice(-1) === '/') {
            url += route;
        } else {
            url += `/${route}`;

        }
    }

    if (!_.isEmpty(queryObject)) {
        url += '?';
        for (const [key, value] of Object.entries(queryObject)) {
            url += `${key}=${encodeURIComponent(value)}&`;
        }

        url = url.slice(0, -1);
    }

    return url;
}

module.exports = buildURL;