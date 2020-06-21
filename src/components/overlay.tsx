import React from 'react';
import { Animated, ViewStyle } from 'react-native';

const Overlay: React.FunctionComponent<{
  style: ViewStyle;
}> = ({ children, style }) => {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: '100%',
        width: '100%',
        ...style,
      }}>
      {children}
    </Animated.View>
  );
};

export default Overlay;
