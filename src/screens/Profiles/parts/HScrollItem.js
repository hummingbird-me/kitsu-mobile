import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'glamorous-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

const HScrollItem = ({ spacing, ...props }) => (
  <View
    marginLeft={spacing}
    {...props}
  />
);

HScrollItem.propTypes = {
  spacing: PropTypes.number,
  props: PropTypes.node,
};

HScrollItem.defaultProps = {
  spacing: scenePadding,
  props: '',
};

export default HScrollItem;
