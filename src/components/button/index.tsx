import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { FontAwesome as Icon } from '@expo/vector-icons';
import { styles } from './styles';

const LoadingComponent = () => (
  <View style={styles.contentWrapper}>
    <ActivityIndicator color={'rgba(255,255,255,0.6)'} />
  </View>
);

export default function Button({
  style,
  title = 'Save',
  titleStyle,
  icon,
  iconStyle,
  onPress,
  loading = false,
  disabled = false,
  bold = false,
}: {
  style?: ViewStyle;
  title: string;
  titleStyle?: TextStyle;
  icon?: string;
  iconStyle?: TextStyle;
  onPress: Function;
  loading: boolean;
  disabled: boolean;
  bold: boolean;
}) {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.button, disabled ? styles.buttonDisabled : null, style]}>
      {loading ? (
        <LoadingComponent />
      ) : (
        <View style={styles.contentWrapper}>
          {icon ? <Icon name={icon} style={[styles.icon, iconStyle]} /> : null}
          <Text
            style={[styles.title, titleStyle, bold ? styles.titleBold : null]}>
            {title}
          </Text>
        </View>
      )}
    </Component>
  );
}
