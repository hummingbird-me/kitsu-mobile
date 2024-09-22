import React from 'react';
import {
  Modal as ModalRN,
  Text,
  TouchableOpacity,
  View,
  type ModalProps as ModalPropsRN,
  type ViewStyle,
} from 'react-native';

import { styles } from './styles';

type ToastProps = {
  style?: ViewStyle;
  onDismiss(...args: unknown[]): unknown;
  title: string;
  visible: boolean;
  onRequestClose(...args: unknown[]): unknown;
} & ModalPropsRN;

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
    {...otherProps}>
    <TouchableOpacity
      activeOpacity={1}
      style={styles.modalContainer}
      onPress={onDismiss}>
      <View style={[styles.contentContainer, style]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  </ModalRN>
);
