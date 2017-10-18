import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { listBackPurple } from 'kitsu/constants/colors';
import { styles } from './styles';

export const SceneContainer = ({ backgroundColor, ...props }) => (
  <View
    style={[
      styles.sceneContainer,
      { backgroundColor: backgroundColor || listBackPurple },
    ]}
    {...props}
  />
);

SceneContainer.propTypes = {
  backgroundColor: PropTypes.string,
};

SceneContainer.defaultProps = {
  backgroundColor: null,
};
