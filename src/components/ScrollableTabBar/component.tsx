import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { commonStyles } from 'kitsu/common/styles';
import { styles } from './styles';

interface ScrollableTabBarProps {
  goToPage?(...args: unknown[]): unknown;
  activeTab?: number;
  tabs?: unknown[];
}

export const ScrollableTabBar = ({
  goToPage,
  activeTab,
  tabs
}: ScrollableTabBarProps) => (
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

ScrollableTabBar.defaultProps = {
  goToPage: () => {},
  activeTab: 0,
  tabs: [],
};
