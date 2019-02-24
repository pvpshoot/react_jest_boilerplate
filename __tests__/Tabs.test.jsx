import React from 'react';
import fs from 'fs';
import { mount } from 'enzyme';
import Cookie from 'js-cookie';
import nock from 'nock';

import App from '../src/components/App';
import { CORS_PROXY } from '../src/utils/apiClient';
import rssService from '../src/utils/rssService';

jest.mock('js-cookie');

const tabNavContainerSelector = '[data-test="tab-anchor-container"]';
const tabNavSelector = 'li[data-test="tab-anchor"]';
const tabRemoveButtonSelector = '[data-test="tab-remove-button"]';
const tabAddButtonSelector = '[data-test="tab-add-button"]';
const tabContentSelector = 'div[data-test="tab-content"]';
const tabModalSelector = '[data-test="tab-modal-show-true"]';
const tabRssForm = '[data-test="tab-modal-form"]';
const tabRssSubmitButton = '[data-test="tab-modal-submit-button"]';
const tabRssInput = '[data-test="tab-rss-input"]';
const tabContentListItem = '[data-test="tab-content-list-item"]';
const tabContentListItemTitle = '[data-test="tab-content-list-item-title"]';

const delay = t => new Promise((resolve) => {
  setTimeout(() => resolve(), t);
});

const createSelector = wrapper => ({
  getAnchorList: () => wrapper.find(tabNavSelector),
  getLastAnchor: () => wrapper.find(tabNavSelector).last(),
  getNthAnchor: n => wrapper.find(tabNavSelector).at(n),
  getRemoveButton: () => wrapper.find(tabRemoveButtonSelector),
  getAddButton: () => wrapper.find(tabAddButtonSelector),
  getNavContainer: () => wrapper.find(tabNavContainerSelector),
  getFirstNavContainer: () => wrapper.find(tabNavContainerSelector).first(),
  getContentList: () => wrapper.find(tabContentSelector),
  getLastContent: () => wrapper.find(tabContentSelector).last(),
  getModal: () => wrapper.find(tabModalSelector),
  getRssForm: () => wrapper.find(tabRssForm),
  getRssSubmitButton: () => wrapper.find(tabRssSubmitButton),
  getRssInput: () => wrapper.find(tabRssInput),
  getNthContentListItem: n => wrapper.find(tabContentListItem).at(n),
  getNthContentListItemItem: n => wrapper.find(tabContentListItemTitle).at(n),
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

  it('add tab', async () => {
    const mockUrl = 'https://habr.com/ru/';
    const fixture = fs.readFileSync('__fixtures__/rss.xml', 'utf-8');
    const delayResponseTime = 2000;
    nock(`${CORS_PROXY}`)
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get(`/?${mockUrl}`)
      .delayBody(2000)
      .reply(200, fixture);

    const wrapper = mount(<App />);
    const s = createSelector(wrapper);
    const addButton = s.getAddButton();
    expect(s.getLastAnchor()).not.toHaveProp('aria-selected', 'true');

    addButton.simulate('click');
    s.getRssInput().simulate('change', {
      target: { value: mockUrl },
    });
    s.getRssForm().simulate('submit');

    await delay(100);
    expect(s.getRssSubmitButton()).toHaveProp('disabled', true);
    await delay(delayResponseTime);
    wrapper.update();
    expect(s.getRssSubmitButton()).toHaveProp('disabled', false);

    const parsedFixture = await rssService.parse(fixture);
    const items = rssService.items(parsedFixture);
    items.forEach((item, index) => {
      expect(s.getNthContentListItemItem(index)).toHaveText(rssService.itemTitle(item));
    });
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
