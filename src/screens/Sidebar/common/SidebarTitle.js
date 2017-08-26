import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { commonStyles } from 'kitsu/common/styles';

const SidebarTitle = ({ title, style }) => (
  <View
    style={[
      {
        marginTop: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.listBackPurple,
      },
      style,
    ]}
  >
    <Text style={[commonStyles.text, { color: colors.white, fontWeight: 'normal' }]}>
      {title}
    </Text>
  </View>
);

SidebarTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

SidebarTitle.defaultProps = {
  title: 'Settings',
};

export default SidebarTitle;
