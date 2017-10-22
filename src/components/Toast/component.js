import React from 'react';
import { View, ViewPropTypes, Text, TouchableOpacity, Modal as ModalRN } from 'react-native';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

export const Toast = ({ visible, title, onRequestClose, onDismiss, ...otherProps }) => (
  <ModalRN
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onRequestClose}
    {...otherProps}
  >
    <TouchableOpacity activeOpacity={1} style={styles.modalContainer} onPress={onDismiss}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {/* <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
          <Icon style={styles.icon} name={'cancel'} />
</TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  </ModalRN>
);

Toast.propTypes = {
  ...ModalRN.propTypes,
  onDismiss: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
