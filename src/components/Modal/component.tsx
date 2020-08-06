import React from 'react';
import { View, Text, TouchableOpacity, Modal as ModalRN } from 'react-native';
import { styles } from './styles';

export const Modal = ({
  style = {},
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
}: any) => (
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
