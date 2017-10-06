import React from 'react';
import glamorous from 'glamorous-native';
import LinearGradient from 'react-native-linear-gradient';

const StyledLinearGradient = glamorous(LinearGradient)(
  {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    height: 40,
  },
);

export default () => <StyledLinearGradient colors={['#000000', 'transparent']} />;
