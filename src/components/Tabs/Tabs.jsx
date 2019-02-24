import React from 'react';
import {
  Tab, TabList, TabPanel, Tabs as TabsContainer,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import serialize from 'form-serialize';
import Cookies from 'js-cookie';
import nanoid from 'nanoid';
import * as R from 'ramda';
import Modal from 'rc-dialog';
import 'rc-dialog/assets/bootstrap.css';

import apiClient from '../../utils/apiClient';
import patchSetState from '../../utils/patchSetState';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemoveTab = R.curryN(2, this.handleRemoveTab);

    patchSetState(this);

    this.state = {
      showModal: false,
      loading: false,
      hasError: false,
      tabIndex: this.getSavedIndex(),
      tabs: [
        { title: 'Tab 1', content: 'Content 1', uid: nanoid() },
        { title: 'Tab 2', content: 'Content 2', uid: nanoid() },
        { title: 'Tab 3', content: 'Content 3', uid: nanoid() },
      ],
    };
  }

  getSavedIndex = () => {
    const tabIndex = Cookies.get('tabIndex');
    if (R.isNil(tabIndex)) return 1;
    return parseInt(tabIndex, 10);
  };

  setSavedIndex = (index) => {
    Cookies.set('tabIndex', Math.min(index, 3));
  };

  makeTab = (title, content) => ({ title, content, uid: nanoid() });

  addTab = (title, content) => {
    const { tabs } = this.state;
    const tabsCount = tabs.length;
    const newTab = this.makeTab(title, content);
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
    this.setSavedIndex(tabIndex);
  };

  showError = () => {
    this.setState({ hasError: true });
  };

  hideError = () => {
    this.setState({ hasError: false });
  };

  showLoader = () => {
    this.setState({ loading: true });
  };

  hideLoader = () => {
    this.setState({ loading: false });
  };

  closeModal = () => {
    this.hideError();
    this.hideLoader();
    this.setState({ showModal: false });
  };

  openModal = () => {
    this.setState({ showModal: true });
  };

  handleTabSelect = (tabIndex) => {
    this.setActiveTab(tabIndex);
  };

  handleAddTab = () => {
    this.openModal();
  };

  handleRemoveTab = (uid) => {
    this.removeTab(uid);
  };

  handleFormSubmit = async (e) => {
    e.preventDefault();
    this.showLoader();
    const { rss: rssLink } = serialize(e.target, { hash: true });
    try {
      const rss = await apiClient.getRssFeed(rssLink);
      this.addTab(rssLink, rss);
      this.closeModal();
    } catch (error) {
      this.showError();
      throw new Error(error);
    } finally {
      this.hideLoader();
    }
  };

  renderTabAnchors = tabs => tabs.map(({ title, uid }) => (
    <Tab data-test="tab-anchor" key={uid}>
      {title}
    </Tab>
  ));

  renderTabContents = tabs => tabs.map(({ content, uid }) => (
    <TabPanel data-test="tab-content" key={uid}>
      <pre>
        <code>{content}</code>
      </pre>
      {this.renderRemoveButton(uid)}
    </TabPanel>
  ));

  renderRemoveButton = uid => (
    <button type="button" onClick={this.handleRemoveTab(uid)} data-test="tab-remove-button">
      remove this tab
    </button>
  );

  renderModal = () => {
    const { showModal, loading } = this.state;
    return (
      <Modal
        visible={showModal}
        closable={!loading}
        maskClosable={!loading}
        title="Создай свой таб с RSS"
        animation="slide-fade"
        maskAnimation="fade"
        onClose={this.closeModal}
      >
        <form onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <input
              required
              type="url"
              className="form-control"
              id="rssInput"
              name="rss"
              aria-describedby="rss link"
              placeholder="Enter rss feed link"
            />
          </div>
          {this.renderError()}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {this.renderLoader()}
            СОБМИТ
          </button>
        </form>
      </Modal>
    );
  };

  renderLoader = () => {
    const { loading } = this.state;
    if (!loading) return null;
    return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />;
  };

  renderError() {
    const { hasError } = this.state;
    if (!hasError) return null;
    return (
      <div className="alert alert-danger" role="alert">
        Чот пошло не так, чекни консоль!
      </div>
    );
  }

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
          <TabList data-test="tab-anchor-container">{this.renderTabAnchors(tabs)}</TabList>
          {this.renderTabContents(tabs)}
        </TabsContainer>
        {this.renderModal()}
      </>
    );
  }
}

export default Tabs;
