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

  it('add tab', () => {
    const wrapper = mount(<App />);
    const tabAnchorList = wrapper.find('[data-test="tab-anchor"]');
    const addButton = wrapper.find('[data-test="tab-add-button"]');
    const tabsCount = tabAnchorList.hostNodes().length;

    addButton.simulate('click');
    expect(wrapper.find('[data-test="tab-anchor"]').hostNodes()).toHaveLength(tabsCount + 1);
  });

  it('remove tab', () => {
    const wrapper = mount(<App />);
    const tabAnchorList = wrapper.find('[data-test="tab-anchor"]');
    const removeButton = wrapper.find('[data-test="tab-remove-button"]');
    const tabsCount = tabAnchorList.hostNodes().length;

    removeButton.simulate('click');
    expect(wrapper.find('[data-test="tab-anchor"]').hostNodes()).toHaveLength(tabsCount - 1);
  });
});
