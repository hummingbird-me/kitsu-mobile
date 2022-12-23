import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { commonStyles } from 'kitsu/common/styles';
import * as colors from 'kitsu/constants/colors';

interface SidebarTitleProps {
  title: string;
}

const SidebarTitle = ({ title, style }: SidebarTitleProps) => (
  <View style={[styles.titleWrapper, style]}>
    <Text
      style={[commonStyles.text, { color: colors.white, fontWeight: 'normal' }]}
    >
      {title}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  titleWrapper: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.listBackPurple,
  },
});

SidebarTitle.defaultProps = {
  title: 'Settings',
};

export default SidebarTitle;
