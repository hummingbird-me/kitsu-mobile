import React from 'react';
import { View, ViewPropTypes, Text, TouchableOpacity, Modal as ModalRN } from 'react-native';
import { PropTypes } from 'prop-types';
import { styles } from './styles';

export const Toast = ({ style, visible, title, onRequestClose, onDismiss, ...otherProps }) => (
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
  style: ViewPropTypes.style,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

Toast.defaultProps = {
  style: null,
};
