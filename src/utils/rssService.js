import * as R from 'ramda';

import { parser } from './apiClient';

const rssService = {
  parse: str => parser.parseString(str),
  items: R.prop('items'),
  description: R.prop('description'),
  itemTitle: R.prop('title'),
  itemCategories: R.prop('categories'),
};

export default rssService;
