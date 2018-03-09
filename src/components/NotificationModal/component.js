import React from 'react';
import { View, ViewPropTypes, Text, StatusBar, Modal, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { PropTypes } from 'prop-types';
import { parseNotificationData } from 'kitsu/screens/Notifications/NotificationsScreen';
import { styles } from './styles';

/**
 * @deprecated Use `NotificationPopover` instead. Will be removed in a future version.
*/
export const NotificationModal = ({ style, visible, onRequestClose, data, ...otherProps }) => {
  if (!data) return null;
  const { actorName, actorAvatar, others, text } = parseNotificationData(data.activities);
  console.log(actorName, others, text);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}
      {...otherProps}
    >
      <TouchableOpacity activeOpacity={1} onPress={onRequestClose} style={styles.modalWrapper}>
        <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0.3)'} barStyle={'light-content'} />
        <TouchableOpacity activeOpacity={0.9} onPress={() => {}} style={styles.modalContent}>
          <View style={{ paddingRight: 10 }}>
            <FastImage style={styles.userAvatar} source={{ uri: actorAvatar }} borderRadius={20} />
          </View>
          <Text style={[styles.activityText, styles.activityTextHighlight]}>
            {actorName || 'Unknown'}
          </Text>
          <Text style={styles.activityText}>
            {others && <Text>and {others}</Text>}
            <Text style={styles.modalText}>{text}</Text>
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

NotificationModal.propTypes = {
  ...Modal.propTypes,
  style: ViewPropTypes.style,
  data: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
NotificationModal.defaultProps = {
  style: null,
  data: null,
};
