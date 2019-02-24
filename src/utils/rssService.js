import * as R from 'ramda';

const rssService = {
  items: R.prop('items'),
  description: R.prop('description'),
  itemTitle: R.prop('title'),
  itemCategories: R.prop('categories'),
};

export default rssService;
