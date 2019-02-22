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
    <TabsContainer defaultIndex={defaults}>
      <TabList>
        <Tab>1</Tab>
        <Tab disabled>2</Tab>
        <Tab>3</Tab>
        <Tab>4</Tab>
        <Tab>5</Tab>
      </TabList>

      <TabPanel>1</TabPanel>
      <TabPanel>2</TabPanel>
      <TabPanel>3</TabPanel>
      <TabPanel>4</TabPanel>
      <TabPanel>5</TabPanel>
    </TabsContainer>
  );
}
