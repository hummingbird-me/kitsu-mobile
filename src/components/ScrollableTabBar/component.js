import * as React from 'react';
import { PropTypes } from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import { commonStyles } from 'kitsu/common/styles';
import { styles } from './styles';

export const ScrollableTabBar = ({ goToPage, activeTab, tabs }) => (
  <View style={styles.tabBarContainer}>
    {tabs.map((tab, i) => (
      <TouchableOpacity
        key={tab}
        transparent
        onPress={() => goToPage(i)}
        style={styles.tab}
      >
        <Text
          style={[
            commonStyles.text,
            (activeTab === i ? commonStyles.colorActiveRed : commonStyles.colorLightGrey),
          ]}
        >
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

ScrollableTabBar.propTypes = {
  goToPage: PropTypes.func,
  activeTab: PropTypes.number,
  tabs: PropTypes.array,
};

ScrollableTabBar.defaultProps = {
  goToPage: () => {},
  activeTab: 0,
  tabs: [],
};
