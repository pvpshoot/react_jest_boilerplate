import React from 'react';
import { mount } from 'enzyme';

import App from '../src/components/App';

describe('Tabs', () => {
  it('select tab', () => {
    const wrapper = mount(<App />);
    const tabContentsList = wrapper.find('[data-test="tab-content"]');
    const tabAnchorList = wrapper.find('[data-test="tab-anchor"]');
    const tabAnchor = tabAnchorList.at(2);
    const tabContent = tabContentsList.at(2);

    tabAnchor.simulate('click');
    expect(tabContent.render()).toMatchSnapshot();
  });
});
