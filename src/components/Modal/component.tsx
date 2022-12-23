import React from 'react';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { View, Text, TouchableOpacity, Modal as ModalRN } from 'react-native';
import { styles } from './styles';

interface ModalProps {
  style?: unknown;
  onConfirm(...args: unknown[]): unknown;
  onCancel(...args: unknown[]): unknown;
  title: string;
  visible: boolean;
  onRequestClose(...args: unknown[]): unknown;
  contentStyle?: unknown;
  headerStyle?: unknown;
  bodyStyle?: unknown;
}

export const Modal = ({
  style,
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
    {...otherProps}
  >
    <View style={[styles.modalContent, contentStyle]}>
      <View style={[styles.modalHeader, headerStyle]}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={[styles.modalHeaderText, styles.modalCancelButton]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.modalHeaderText}>{title}</Text>
        <TouchableOpacity onPress={onConfirm}>
          <Text style={[styles.modalHeaderText, styles.modalDoneButton]}>Done</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.modalBody, bodyStyle]}>{children}</View>
    </View>
  </ModalRN>
);

Modal.propTypes = {
  ...ModalRN.propTypes,
  style: ViewPropTypes.style,
  contentStyle: ViewPropTypes.style,
  headerStyle: ViewPropTypes.style,
  bodyStyle: ViewPropTypes.style
};
Modal.defaultProps = {
  style: null,
  contentStyle: null,
  headerStyle: null,
  bodyStyle: null,
};
