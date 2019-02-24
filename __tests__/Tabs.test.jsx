import React from 'react';
import { mount } from 'enzyme';
import Cookie from 'js-cookie';

import App from '../src/components/App';

jest.mock('js-cookie');

const tabNavContainerSelector = '[data-test="tab-anchor-container"]';
const tabNavSelector = 'li[data-test="tab-anchor"]';
const tabRemoveButtonSelector = '[data-test="tab-remove-button"]';
const tabAddButtonSelector = '[data-test="tab-add-button"]';
const tabAreaSelectedSelector = '[aria-selected="true"]';
const tabContentSelector = 'div[data-test="tab-content"]';

const createSelector = wrapper => ({
  getAnchorList: () => wrapper.find(tabNavSelector),
  getLastAnchor: () => wrapper.find(tabNavSelector).last(),
  getNthAnchor: n => wrapper.find(tabNavSelector).at(n),
  getRemoveButton: () => wrapper.find(tabRemoveButtonSelector),
  getAddButton: () => wrapper.find(tabAddButtonSelector),
  getNavContainer: () => wrapper.find(tabNavContainerSelector),
  getFirstNavContainer: () => wrapper.find(tabNavContainerSelector).first(),
  getContentList: () => wrapper.find(tabContentSelector),
  reloadApp: () => wrapper.unmount().mount(),
});

describe('Tabs', () => {
  it('select tab', () => {
    const TEST_INDEX = 2;
    const wrapper = mount(<App />);
    const s = createSelector(wrapper);
    const tabAnchor = s.getNthAnchor(TEST_INDEX);

    tabAnchor.simulate('click');
    expect(s.getNthAnchor(TEST_INDEX)).toHaveProp('aria-selected', 'true');
  });

  it('add tab', () => {
    const wrapper = mount(<App />);
    const s = createSelector(wrapper);
    const addButton = s.getAddButton();

    addButton.simulate('click');
    expect(s.getLastAnchor()).toHaveProp('aria-selected', 'true');
  });

  it('reload with saved tab selected', () => {
    const TEST_INDEX = 2;
    function CookieContainer() {
      let selectedTab = TEST_INDEX;
      return {
        get() {
          return selectedTab;
        },
        set(i) {
          selectedTab = i;
        },
      };
    }
    const cooks = CookieContainer();
    Cookie.set.mockImplementation((_, i) => cooks.set(i));
    Cookie.get.mockImplementation(() => cooks.get());

    const wrapper = mount(<App />);
    const s = createSelector(wrapper);
    expect(cooks.get()).toEqual(TEST_INDEX);
    expect(s.getNthAnchor(TEST_INDEX)).toHaveProp('aria-selected', 'true');
    s.getNthAnchor(TEST_INDEX - 1).simulate('click');

    const wrapper2 = mount(<App />);
    const s2 = createSelector(wrapper2);
    expect(cooks.get()).toEqual(TEST_INDEX - 1);
    expect(s2.getNthAnchor(TEST_INDEX - 1)).toHaveProp('aria-selected', 'true');
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
      tabNavSelector,
    );
  });
});
