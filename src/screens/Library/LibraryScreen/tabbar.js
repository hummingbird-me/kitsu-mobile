import React from 'react';
import { ViewPropTypes } from 'react-native';
import { PropTypes } from 'prop-types';
import { TabBar } from 'kitsu/screens/Profiles/components/TabBar';

export const LibraryTabBar = ({
  goToPage, // Provided by react-native-scrollable-tab-view
  renderTab,
  activeTab, // Provided by react-native-scrollable-tab-view
  tabs, // Provided by react-native-scrollable-tab-view
  tabBarStyle,
  tabBarContainerStyle,
}) => (
  <TabBar style={tabBarStyle} containerStyle={tabBarContainerStyle}>
    {tabs.map((name, page) => {
      const isTabActive = activeTab === page;
      return renderTab(name, page, isTabActive, goToPage);
    })}
  </TabBar>
);


LibraryTabBar.propTypes = {
  goToPage: PropTypes.func,
  renderTab: PropTypes.func.isRequired,
  activeTab: PropTypes.number,
  tabs: PropTypes.array,
  tabBarStyle: ViewPropTypes.style,
  tabBarContainerStyle: ViewPropTypes.style,
};

LibraryTabBar.defaultProps = {
  goToPage: () => null,
  activeTab: null,
  tabs: [],
  tabBarStyle: {},
  tabBarContainerStyle: {},
};
