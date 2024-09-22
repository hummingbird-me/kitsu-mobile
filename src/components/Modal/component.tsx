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

type ModalProps = {
  onConfirm(...args: unknown[]): unknown;
  onCancel(...args: unknown[]): unknown;
  title: string;
  visible: boolean;
  onRequestClose(...args: unknown[]): unknown;
  contentStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  bodyStyle?: ViewStyle;
  children: React.ReactNode;
} & ModalPropsRN;

export const Modal = ({
  visible,
  onRequestClose,
  title,
  onConfirm,
  onCancel,
  children,
  contentStyle,
  headerStyle,
  bodyStyle,
  ...otherProps
}: ModalProps) => (
  <ModalRN
    transparent
    animationType="slide"
    visible={visible}
    onRequestClose={onRequestClose}
    {...otherProps}>
    <View style={[styles.modalContent, contentStyle]}>
      <View style={[styles.modalHeader, headerStyle]}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={[styles.modalHeaderText, styles.modalCancelButton]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <Text style={styles.modalHeaderText}>{title}</Text>
        <TouchableOpacity onPress={onConfirm}>
          <Text style={[styles.modalHeaderText, styles.modalDoneButton]}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.modalBody, bodyStyle]}>{children}</View>
    </View>
  </ModalRN>
);
