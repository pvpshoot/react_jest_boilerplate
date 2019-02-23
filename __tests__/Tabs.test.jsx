import React from 'react';
import { mount } from 'enzyme';

import App from '../src/components/App';

const getAnchorList = wrapper => wrapper.find('li[data-test="tab-anchor"]');
const getContentList = wrapper => wrapper.find('div[data-test="tab-content"]');

describe('Tabs', () => {
  it('select tab', () => {
    const TEST_INDEX = 2;
    const wrapper = mount(<App />);
    const tabAnchorList = getAnchorList(wrapper);
    const tabAnchor = tabAnchorList.at(TEST_INDEX);

    tabAnchor.simulate('click');
    expect(getAnchorList(wrapper).at(TEST_INDEX)).toMatchSelector('[aria-selected="true"]');
    expect(getContentList(wrapper).at(TEST_INDEX)).toExist();
  });

  it('add tab', () => {
    const wrapper = mount(<App />);
    const tabAnchorList = getAnchorList(wrapper);
    const addButton = wrapper.find('[data-test="tab-add-button"]');
    const tabsCount = tabAnchorList.hostNodes().length;

    expect(getAnchorList(wrapper)).toHaveLength(tabsCount);
    expect(getContentList(wrapper)).toHaveLength(tabsCount);

    addButton.simulate('click');

    expect(getAnchorList(wrapper)).toHaveLength(tabsCount + 1);
    expect(getContentList(wrapper)).toHaveLength(tabsCount + 1);
    expect(getAnchorList(wrapper).last()).toMatchSelector('[aria-selected="true"]');
  });

  it('remove tab', () => {
    const wrapper = mount(<App />);
    const tabAnchorList = getAnchorList(wrapper);
    const removeButton = wrapper.find('[data-test="tab-remove-button"]');
    const tabsCount = tabAnchorList.length;

    expect(getAnchorList(wrapper)).toHaveLength(tabsCount);
    expect(getContentList(wrapper)).toHaveLength(tabsCount);

    removeButton.simulate('click');

    expect(getAnchorList(wrapper)).toHaveLength(tabsCount - 1);
    expect(getContentList(wrapper)).toHaveLength(tabsCount - 1);
  });
});
