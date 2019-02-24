import axios from 'axios';
import * as R from 'ramda';

import beautify from 'xml-beautifier';

export default {
  getRssFeed(url) {
    return axios
      .get(`https://cors-anywhere.herokuapp.com/${url}`)
      .then(R.prop('data'))
      .then(beautify);
  },
};
