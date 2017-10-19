import React from 'react';
import { View, ViewPropTypes, Text, TouchableOpacity, Modal as ModalRN } from 'react-native';
import { PropTypes } from 'prop-types';
import { styles } from './styles';

export const Modal = ({
  style,
  visible,
  onRequestClose,
  title,
  onConfirm,
  onCancel,
  children,
  headerStyle,
  bodyStyle,
  ...otherProps
}) => (
  <ModalRN
    transparent
    animationType="slide"
    visible={visible}
    onRequestClose={onRequestClose}
    {...otherProps}
  >
    <View style={styles.modalContent}>
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
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  headerStyle: ViewPropTypes.style,
  bodyStyle: ViewPropTypes.style,
};
Modal.defaultProps = {
  style: null,
  headerStyle: null,
  bodyStyle: null,
};
