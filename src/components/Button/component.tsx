import React, { ComponentProps } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles';

const LoadingComponent = () => (
  <View style={styles.contentWrapper}>
    <ActivityIndicator color={'rgba(255,255,255,0.6)'} />
  </View>
);

interface ButtonProps {
  style?: StyleProp<TouchableOpacity | View>;
  title: string;
  titleStyle?: TextStyle | null;
  icon?: string | null;
  iconStyle?: ComponentProps<typeof Icon>['style'];
  onPress?: TouchableOpacityProps['onPress'] | null;
  loading?: boolean;
  disabled?: boolean;
  bold?: boolean;
}

export const Button = ({
  style = null,
  title = 'Save',
  titleStyle = null,
  icon = null,
  iconStyle = null,
  onPress = null,
  loading = false,
  disabled = false,
  bold = false,
}: ButtonProps) => {
  const Component = onPress ? TouchableOpacity : View;
  return (
    <Component
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.button, disabled ? styles.buttonDisabled : null, style]}
    >
      {loading ? (
        <LoadingComponent />
      ) : (
        <View style={styles.contentWrapper}>
          {icon ? <Icon name={icon} style={[styles.icon, iconStyle]} /> : null}
          <Text
            style={[styles.title, titleStyle, bold ? styles.titleBold : null]}
          >
            {title}
          </Text>
        </View>
      )}
    </Component>
  );
};
