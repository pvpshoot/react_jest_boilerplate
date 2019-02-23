import React from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as TabsContainer,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import nanoid from 'nanoid';
import * as R from 'ramda';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemoveTab = R.curryN(2, this.handleRemoveTab);
  }

  state = {
    tabIndex: 1,
    tabs: [
      { title: 'Tab 1', content: 'Content 1', uid: nanoid() },
      { title: 'Tab 2', content: 'Content 2', uid: nanoid() },
      { title: 'Tab 3', content: 'Content 3', uid: nanoid() },
    ],
  };

  makeTab = (index) => {
    const humanIndex = index + 1;
    return { title: `Tab ${humanIndex}`, content: `Content ${humanIndex}`, uid: nanoid() };
  };

  addTab = () => {
    const { tabs } = this.state;
    const tabsCount = tabs.length;
    const newTab = this.makeTab(tabsCount);
    this.setState(
      state => ({
        ...state,
        tabs: [...state.tabs, newTab],
      }),
      () => {
        this.setActiveTab(tabsCount);
      },
    );
  };

  removeTab = (uid) => {
    this.setState(state => ({
      ...state,
      tabs: state.tabs.filter(tab => tab.uid !== uid),
    }));
  };

  setActiveTab = (tabIndex) => {
    this.setState({ tabIndex });
  };

  handleTabSelect = (tabIndex) => {
    this.setActiveTab(tabIndex);
  };

  handleAddTab = () => {
    this.addTab();
  };

  handleRemoveTab = (uid) => {
    this.removeTab(uid);
  };

  renderTabAnchors = tabs => tabs.map(({ title, uid }) => (
    <Tab data-test="tab-anchor" key={uid}>
      {title}
    </Tab>
  ));

  renderTabContents = tabs => tabs.map(({ content, uid }) => (
    <TabPanel data-test="tab-content" key={uid}>
      {content}
      {this.renderRemoveButton(uid)}
    </TabPanel>
  ));

  renderRemoveButton = uid => (
    <button type="button" onClick={this.handleRemoveTab(uid)} data-test="tab-remove-button">
      remove this tab
    </button>
  );

  render() {
    const { tabs, tabIndex } = this.state;
    return (
      <>
        <button type="button" onClick={this.handleAddTab} data-test="tab-add-button">
          Add tab
        </button>
        <TabsContainer
          data-test="tab-container"
          selectedIndex={tabIndex}
          onSelect={this.handleTabSelect}
        >
          <TabList>{this.renderTabAnchors(tabs)}</TabList>
          {this.renderTabContents(tabs)}
        </TabsContainer>
      </>
    );
  }
}

export default Tabs;
