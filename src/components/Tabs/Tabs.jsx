import React from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as TabsContainer,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'js-cookie';
import nanoid from 'nanoid';
import * as R from 'ramda';
import Modal from 'rc-dialog';
import 'rc-dialog/assets/bootstrap.css';

import apiClient from '../../utils/apiClient';
import patchSetState from '../../utils/patchSetState';
import rssService from '../../utils/rssService';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemoveTab = R.curryN(2, this.handleRemoveTab);
    this.containerRef = React.createRef();

    patchSetState(this);

    this.state = {
      showModal: false,
      loading: false,
      hasError: false,
      rssUrl: '',
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

  setError = () => {
    this.setState({ hasError: true });
  };

  removeError = () => {
    this.setState({ hasError: false });
  };

  toggleLoading = (loading) => {
    this.setState({ loading });
  };

  closeModal = () => {
    this.removeError();
    this.toggleLoading(false);
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
    this.toggleLoading(true);
    const { rssUrl } = this.state;
    try {
      const rss = await apiClient.getRssFeed(rssUrl);
      this.addTab(rssService.description(rss), rssService.items(rss));
      this.closeModal();
    } catch (error) {
      this.setError();
      throw new Error(error);
    } finally {
      this.toggleLoading(false);
    }
  };

  renderTabAnchors = tabs => tabs.map(({ title, uid }) => (
    <Tab data-test="tab-anchor" key={uid}>
      {title}
    </Tab>
  ));

  renderTabContents = tabs => tabs.map(({ content, uid }) => (
    <TabPanel data-test="tab-content" key={uid}>
      {this.renderItemList(content)}
      {this.renderRemoveButton(uid)}
    </TabPanel>
  ));

  renderItemList = (content) => {
    if (R.is(String, content)) return content;
    return (
      <ul className="list-group">
        {content.map(el => (
          <li className="list-group-item" key={rssService.itemTitle(el)}>
            {rssService.itemTitle(el)}
            {rssService.itemCategories(el).map(c => (
              <span className="badge badge-dark" key={c}>
                {c}
              </span>
            ))}
          </li>
        ))}
      </ul>
    );
  };

  renderRemoveButton = uid => (
    <button type="button" onClick={this.handleRemoveTab(uid)} data-test="tab-remove-button">
      remove this tab
    </button>
  );

  renderModal = () => {
    const { showModal, loading, rssUrl } = this.state;
    return (
      <Modal
        visible={showModal}
        closable={!loading}
        maskClosable={!loading}
        title="Создай свой таб с RSS"
        animation="slide-fade"
        maskAnimation="fade"
        onClose={this.closeModal}
        getContainer={() => this.containerRef.current}
      >
        <div role="dialog" data-test={`tab-modal-show-${showModal}`} aria-modal={showModal}>
          <form onSubmit={this.handleFormSubmit} data-test="tab-modal-form">
            <div className="form-group">
              <input
                value={rssUrl}
                onChange={e => this.setState({ rssUrl: e.target.value })}
                required
                type="url"
                className="form-control"
                id="rssInput"
                name="rss"
                aria-describedby="rss link"
                placeholder="Enter rss feed link"
                data-test="tab-rss-input"
              />
            </div>
            {this.renderError()}
            <button
              data-test="tab-modal-submit-button"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {this.renderLoader()}
              СОБМИТ
            </button>
          </form>
        </div>
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
      <div ref={this.containerRef}>
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
      </div>
    );
  }
}

export default Tabs;
