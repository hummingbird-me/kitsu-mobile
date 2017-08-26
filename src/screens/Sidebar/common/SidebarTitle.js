import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { commonStyles } from 'kitsu/common/styles';

const SidebarTitle = ({ title, style }) => (
  <View style={[styles.titleWrapper, style]}>
    <Text style={[commonStyles.text, { color: colors.white, fontWeight: 'normal' }]}>
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

SidebarTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

SidebarTitle.defaultProps = {
  title: 'Settings',
};

export default SidebarTitle;
