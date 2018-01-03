import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

export const ScrollItem = ({ spacing, ...props }) => (
  <View style={{ marginRight: spacing }} {...props} />
);

ScrollItem.propTypes = {
  spacing: PropTypes.number,
};

ScrollItem.defaultProps = {
  spacing: scenePadding,
};
