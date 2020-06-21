import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './styles';

const LoadingComponent = () => (
  <View style={styles.contentWrapper}>
    <ActivityIndicator color={'rgba(255,255,255,0.6)'} />
  </View>
);

export default function Button ({
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
  style?: StyleSheet,
  title: string,
  titleStyle?: number | object | any[],
  icon?: string,
  iconStyle?: number | object,
  onPress: Function,
  loading: boolean,
  disabled: boolean,
  bold: boolean
}) {
    /*        {icon ? <Icon name={icon} style={[styles.icon, iconStyle]} /> : null} */
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
          <Text style={[styles.title, bold ? styles.titleBold : null]}>{title}</Text>
        </View>
      )}
    </Component>
  );
};
