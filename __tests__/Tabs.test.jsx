import React from 'react';
import { mount } from 'enzyme';

import App from '../src/components/App';

describe('Tabs', () => {
  it('select tab', () => {
    const wrapper = mount(<App />);
    const tabAnchorList = wrapper.find('[data-test="tab-anchor"]');
    const tabAnchor = tabAnchorList.at(2);

    expect(wrapper.render()).toMatchSnapshot();

    tabAnchor.simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
  });
});
