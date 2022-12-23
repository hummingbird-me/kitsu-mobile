import React from 'react';
import { View } from 'react-native';

import { listBackPurple } from 'kitsu/constants/colors';

import { styles } from './styles';

interface SceneContainerProps {
  backgroundColor?: string;
  marginTop?: number;
}

export const SceneContainer = ({
  backgroundColor,
  marginTop,
  ...props
}: SceneContainerProps) => (
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

SceneContainer.defaultProps = {
  backgroundColor: null,
  marginTop: 0,
};
