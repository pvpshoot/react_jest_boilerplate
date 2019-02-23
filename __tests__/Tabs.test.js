import React from 'react';
import { mount, shallow } from 'enzyme';

import Tabs from '../src/components/Tabs';

describe('Tabs', () => {
  it('renders', () => {
    const wrapper = shallow(<Tabs />);
    expect(wrapper).toMatchSnapshot();
  });

  it('select tab', () => {
    const wrapper = mount(<Tabs />);
    wrapper
      .find('Tab')
      .at(2)
      .simulate('click');
    expect(wrapper).toMatchSnapshot();
  });

  it('use default selected tab', () => {
    const wrapper = mount(<Tabs default={3} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('not react on disables tab', () => {
    const wrapper = mount(<Tabs />);

    wrapper.find({ disabled: true }).simulate('click');
    expect(wrapper).toMatchSnapshot();

    wrapper
      .find('Tab')
      .at(0)
      .simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
});
