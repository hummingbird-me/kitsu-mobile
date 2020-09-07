import React, { FunctionComponent } from 'react';
import {
  Platform,
  ViewStyle,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
} from 'react-native';

const Touchable: FunctionComponent<{
  style?: ViewStyle;
  onPress: any;
  borderless?: boolean;
  disabled?: boolean;
  activeOpacity?: number;
}> = function Touchable({
  borderless = false,
  disabled,
  activeOpacity,
  style,
  onPress,
  children,
}) {
  if (Platform.OS === 'android') {
    const background = borderless
      ? TouchableNativeFeedback.SelectableBackgroundBorderless()
      : TouchableNativeFeedback.SelectableBackground();
    return (
      <TouchableNativeFeedback
        disabled={disabled}
        background={background}
        onPress={onPress}>
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={style}>
        {children}
      </TouchableOpacity>
    );
  }
};

export default Touchable;
