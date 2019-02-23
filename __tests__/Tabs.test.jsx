import React from 'react';
import { mount } from 'enzyme';
import Cookie from 'js-cookie';

import App from '../src/components/App';

jest.mock('js-cookie');

const TAB_NAV_CONTAINER_SELECTOR = '[data-test="tab-anchor-container"]';
const TAB_NAV_SELECTOR = 'li[data-test="tab-anchor"]';
const TAB_REMOVE_BUTTON_SELECTOR = '[data-test="tab-remove-button"]';
const TAB_ADD_BUTTON_SELECTOR = '[data-test="tab-add-button"]';
const TAB_AREA_SELECTED_SELECTOR = '[aria-selected="true"]';
const TAB_CONTENT_SELECTOR = 'div[data-test="tab-content"]';

const createSelector = wrapper => ({
  getAnchorList: () => wrapper.find(TAB_NAV_SELECTOR),
  getLastAnchor: () => wrapper.find(TAB_NAV_SELECTOR).last(),
  getNthAnchor: n => wrapper.find(TAB_NAV_SELECTOR).at(n),
  getRemoveButton: () => wrapper.find(TAB_REMOVE_BUTTON_SELECTOR),
  getAddButton: () => wrapper.find(TAB_ADD_BUTTON_SELECTOR),
  getNavContainer: () => wrapper.find(TAB_NAV_CONTAINER_SELECTOR),
  getFirstNavContainer: () => wrapper.find(TAB_NAV_CONTAINER_SELECTOR).first(),
  getContentList: () => wrapper.find(TAB_CONTENT_SELECTOR),
});

describe('Tabs', () => {
  it('select tab', () => {
    const TEST_INDEX = 2;
    const wrapper = mount(<App />);
    const s = createSelector(wrapper);
    const tabAnchorList = s.getAnchorList();
    const tabAnchor = tabAnchorList.at(TEST_INDEX);

    tabAnchor.simulate('click');
    expect(s.getAnchorList().at(TEST_INDEX)).toMatchSelector(TAB_AREA_SELECTED_SELECTOR);
  });

  it('add tab', () => {
    const wrapper = mount(<App />);
    const s = createSelector(wrapper);
    const addButton = s.getAddButton();

    addButton.simulate('click');
    expect(s.getLastAnchor()).toMatchSelector(TAB_AREA_SELECTED_SELECTOR);
  });

  it('reload with saved tab selected', () => {
    const TEST_INDEX = 2;
    Cookie.get.mockImplementation(() => TEST_INDEX);

    const wrapper = mount(<App />);
    const s = createSelector(wrapper);

    expect(s.getNthAnchor(TEST_INDEX)).toMatchSelector(TAB_AREA_SELECTED_SELECTOR);
  });

  it('remove tab', () => {
    const wrapper = mount(<App />);
    const s = createSelector(wrapper);
    const tabAnchorList = s.getAnchorList();
    const removeButton = s.getRemoveButton();

    removeButton.simulate('click');

    const anchorsLengthAfterRemoveCount = tabAnchorList.length - 1;
    const anchorsContainer = s.getFirstNavContainer();

    expect(anchorsContainer).toContainMatchingElements(
      anchorsLengthAfterRemoveCount,
      TAB_NAV_SELECTOR,
    );
  });
});
