import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { listBackPurple } from 'kitsu/constants/colors';
import { styles } from './styles';

export const SceneContainer = ({ backgroundColor, marginTop, ...props }) => (
  <View
    style={[
      styles.sceneContainer,
      {
        backgroundColor: backgroundColor || listBackPurple,
        marginTop,
      },
    ]}
    {...props}
  />
);

SceneContainer.propTypes = {
  backgroundColor: PropTypes.string,
  marginTop: PropTypes.number,
};

SceneContainer.defaultProps = {
  backgroundColor: null,
  marginTop: 0,
};
