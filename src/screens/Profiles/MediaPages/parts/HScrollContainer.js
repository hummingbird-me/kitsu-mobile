import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { scenePadding } from '../constants';

const HScrollContainer = ({ spacing, ...props }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
      marginLeft: spacing * -1,
      paddingRight: scenePadding,
    }}
    style={{
      paddingHorizontal: scenePadding,
      marginTop: scenePadding,
    }}
    {...props}
  />
);

HScrollContainer.propTypes = {
  spacing: PropTypes.number,
  props: PropTypes.any,
};

HScrollContainer.defaultProps = {
  spacing: scenePadding,
  props: '',
};

export default HScrollContainer;
