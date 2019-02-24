import Parser from 'rss-parser';

export const parser = new Parser();
export const CORS_PROXY = 'https://cors.io/';

export default {
  getRssFeed(url) {
    return parser.parseURL(`${CORS_PROXY}?${url}`);
  },
};
