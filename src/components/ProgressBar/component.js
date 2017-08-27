import * as React from 'react';
import { View, ViewPropTypes } from 'react-native';
import { PropTypes } from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

export const ProgressBar = (props) => {
  let fillPercentage = props.fillPercentage;
  if (fillPercentage > 100) {
    fillPercentage = 100;
  } else if (fillPercentage < 0) {
    fillPercentage = 0;
  }

  const fillStyle = {
    height: props.height,
    backgroundColor: props.fillColor,
    width: `${fillPercentage}%`,
    borderRadius: props.height,
  };

  return (
    <View style={[
      styles.background,
      props.backgroundStyle,
      { height: props.height, borderRadius: props.height },
    ]}
    >
      <View style={fillStyle} />
    </View>
  );
};

ProgressBar.propTypes = {
  backgroundStyle: ViewPropTypes.style,
  fillColor: PropTypes.string,
  fillPercentage: PropTypes.number,
  height: PropTypes.number,
};

ProgressBar.defaultProps = {
  backgroundStyle: {},
  fillColor: colors.green,
  fillPercentage: 0,
  height: 5,
};
