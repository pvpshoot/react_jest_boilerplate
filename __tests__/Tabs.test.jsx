import React from 'react';
import { mount } from 'enzyme';

import App from '../src/components/App';

const TAB_NAV_CONTAINER_SELECTOR = '[data-test="tab-anchor-container"]';
const TAB_NAV_SELECTOR = 'li[data-test="tab-anchor"]';
const TAB_REMOVE_BUTTON_SELECTOR = '[data-test="tab-remove-button"]';
const TAB_ADD_BUTTON_SELECTOR = '[data-test="tab-add-button"]';
const TAB_AREA_SELECTED_SELECTOR = '[aria-selected="true"]';
const TAB_CONTENT_SELECTOR = 'div[data-test="tab-content"]';

const getAnchorList = wrapper => wrapper.find(TAB_NAV_SELECTOR);
const getContentList = wrapper => wrapper.find(TAB_CONTENT_SELECTOR);
const getRemoveButton = wrapper => wrapper.find(TAB_REMOVE_BUTTON_SELECTOR);
const getAddButton = wrapper => wrapper.find(TAB_ADD_BUTTON_SELECTOR);
const getNavContainer = wrapper => wrapper.find(TAB_NAV_CONTAINER_SELECTOR);

describe('Tabs', () => {
  it('select tab', () => {
    const TEST_INDEX = 2;
    const wrapper = mount(<App />);
    const tabAnchorList = getAnchorList(wrapper);
    const tabAnchor = tabAnchorList.at(TEST_INDEX);

    tabAnchor.simulate('click');
    expect(getAnchorList(wrapper).at(TEST_INDEX)).toMatchSelector(TAB_AREA_SELECTED_SELECTOR);
  });

  it('add tab', () => {
    const wrapper = mount(<App />);
    const addButton = getAddButton(wrapper);

    addButton.simulate('click');
    expect(getAnchorList(wrapper).last()).not.toMatchSelector(TAB_AREA_SELECTED_SELECTOR);
  });

  it('remove tab', () => {
    const wrapper = mount(<App />);
    const tabAnchorList = getAnchorList(wrapper);
    const removeButton = getRemoveButton(wrapper);

    removeButton.simulate('click');

    const anchorsLengthAfterRemoveCount = tabAnchorList.length - 1;
    const anchorsContainer = getNavContainer(wrapper).first();

    expect(anchorsContainer).toContainMatchingElements(
      anchorsLengthAfterRemoveCount,
      TAB_NAV_SELECTOR,
    );
  });
});
