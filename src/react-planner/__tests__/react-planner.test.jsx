import React from 'react';
import { shallow } from 'enzyme';
import ReactPlanner from '../ReactPlanner';

describe('ReactPlanner', () => {
  const props = {
    width: 800,
    height: 600,
    stateExtractor: () => ({}),
    translator: {},
    catalog: {},
    plugins: [],
    toolbarButtons: [],
    sidebarComponents: [],
    footerbarComponents: [],
    customContents: {},
  };

  it('renders without crashing', () => {
    shallow(<ReactPlanner {...props} />);
  });

  it('should render four components', () => {
    const wrapper = shallow(<ReactPlanner {...props} />);
    expect(wrapper.find('Toolbar')).toHaveLength(1);
    expect(wrapper.find('Content')).toHaveLength(1);
    expect(wrapper.find('Sidebar')).toHaveLength(1);
    expect(wrapper.find('FooterBar')).toHaveLength(1);
  });
});