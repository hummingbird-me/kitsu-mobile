import React, { FunctionComponent } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import * as styles from './styles';

const Button: FunctionComponent<{
  kind?: keyof typeof styles.kinds;
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
  bare = true,
  disabled = false,
  loading = false,
}) {
  if (disabled) kind = 'disabled';

  const { button, text } = styles.styleSheetForKind(kind);

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.base.button, button, style]}>
      <View style={styles.base.contentWrapper}>
        {loading ? (
          <ActivityIndicator color={'rgba(255,255,255,0.6)'} />
        ) : bare ? (
          <Text style={[text, textStyle]}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
export { styles };
