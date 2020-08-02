import React from 'react';
import { Animated, ViewStyle, useWindowDimensions } from 'react-native';

const Overlay: React.FunctionComponent<{
  style: Animated.WithAnimatedValue<ViewStyle>;
}> = ({ children, style }) => {
  const { width, height } = useWindowDimensions();
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height,
        width,
        ...style,
      }}>
      {children}
    </Animated.View>
  );
};

export default Overlay;
