import React from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as TabsContainer,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default function Tabs(props) {
  const { defaults = null } = props;
  return (
    <TabsContainer defaultIndex={defaults} data-test="tab-container">
      <TabList>
        <Tab data-test="tab-anchor">1</Tab>
        <Tab data-test="tab-anchor" disabled>
          2
        </Tab>
        <Tab data-test="tab-anchor">3</Tab>
        <Tab data-test="tab-anchor">4</Tab>
        <Tab data-test="tab-anchor">5</Tab>
      </TabList>

      <TabPanel data-test="tab-content">1</TabPanel>
      <TabPanel data-test="tab-content">2</TabPanel>
      <TabPanel data-test="tab-content">3</TabPanel>
      <TabPanel data-test="tab-content">4</TabPanel>
      <TabPanel data-test="tab-content">5</TabPanel>
    </TabsContainer>
  );
}
