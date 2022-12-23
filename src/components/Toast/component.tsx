import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import React from 'react';
import { View, Text, TouchableOpacity, Modal as ModalRN } from 'react-native';
import { styles } from './styles';

interface ToastProps {
  style?: unknown;
  onDismiss(...args: unknown[]): unknown;
  title: string;
  visible: boolean;
  onRequestClose(...args: unknown[]): unknown;
}

export const Toast = ({
  style,
  visible,
  title,
  onRequestClose,
  onDismiss,
  ...otherProps
}: ToastProps) => (
  <ModalRN
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onRequestClose}
    {...otherProps}
  >
    <TouchableOpacity activeOpacity={1} style={styles.modalContainer} onPress={onDismiss}>
      <View style={[styles.contentContainer, style]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  </ModalRN>
);

Toast.propTypes = {
  ...ModalRN.propTypes,
  style: ViewPropTypes.style
};

Toast.defaultProps = {
  style: null,
};
