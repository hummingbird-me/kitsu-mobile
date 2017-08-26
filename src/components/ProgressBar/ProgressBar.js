import React from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const ProgressBar = (props) => {
  const width = `${props.progress * 100}%`;

  return (
    <View {...props} style={[styles.outer, props.style]}>
      <View style={[styles.inner, { minWidth: width, maxWidth: width }]} />
    </View>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  style: ViewPropTypes.style,
};

ProgressBar.defaultProps = {
  progress: 0,
  style: null,
};

export default ProgressBar;
