import React, { FunctionComponent } from 'react';
import {
  View,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import * as styles from './styles';

const Button: FunctionComponent<{
  kind: keyof typeof styles.kinds;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress: any;
  bare?: boolean;
  loading?: boolean;
  disabled?: boolean;
}> = function ({
  kind,
  style,
  textStyle,
  onPress,
  children,
  bare = false,
  disabled = false,
  loading = false,
}) {
  if (disabled) kind = 'disabled';

  const { button, text } = styles.styleSheetForKind(kind);

  const contents = (
    <View style={styles.base.contentWrapper}>
      {loading ? (
        <ActivityIndicator color={'rgba(255,255,255,0.6)'} />
      ) : bare ? (
        children
      ) : (
        <Text style={[styles.accessory.text, text, textStyle]}>{children}</Text>
      )}
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback onPress={onPress} disabled={disabled || loading}>
        <View style={[styles.base.button, button, style]}>{contents}</View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity
        disabled={disabled || loading}
        onPress={onPress}
        style={[styles.base.button, button, style]}>
        {contents}
      </TouchableOpacity>
    );
  }
};

export default Button;
export { styles };
