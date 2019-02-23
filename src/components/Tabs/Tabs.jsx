import React from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as TabsContainer,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import nanoid from 'nanoid';

class Tabs extends React.Component {
  state = {
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
    this.setState(state => ({
      ...state,
      tabs: [...state.tabs, newTab],
    }));
  };

  removeTab = (uid) => {
    this.setState(state => ({
      ...state,
      tabs: state.tabs.filter(tab => tab.uid !== uid),
    }));
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
    <button type="button" onClick={() => this.removeTab(uid)} data-test="tab-remove-button">
      remove this tab
    </button>
  );

  render() {
    const { tabs } = this.state;
    return (
      <>
        <button type="button" onClick={this.addTab} data-test="tab-add-button">
          Add tab
        </button>
        <TabsContainer data-test="tab-container">
          <TabList>{this.renderTabAnchors(tabs)}</TabList>
          {this.renderTabContents(tabs)}
        </TabsContainer>
      </>
    );
  }
}

export default Tabs;
