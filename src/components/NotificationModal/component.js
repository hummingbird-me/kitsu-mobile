import React from 'react';
import { View, ViewPropTypes, Text, StatusBar, Modal } from 'react-native';
import { PropTypes } from 'prop-types';
import { styles } from './styles';

export const NotificationModal = ({ style, visible, onRequestClose, message, ...otherProps }) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onRequestClose}
    {...otherProps}
  >
    <View style={styles.modalWrapper}>
      <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0.3)'} barStyle={'light-content'} />
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{message}</Text>
      </View>
    </View>
  </Modal>
);

NotificationModal.propTypes = {
  ...Modal.propTypes,
  style: ViewPropTypes.style,
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
NotificationModal.defaultProps = {
  style: null,
};
