import React from 'react';
import { View, ViewPropTypes, Text, StatusBar, Modal } from 'react-native';
import { PropTypes } from 'prop-types';
import { parseNotificationData } from 'kitsu/screens/Notifications/NotificationsScreen';
import { styles } from './styles';

export const NotificationModal = ({ style, visible, onRequestClose, data, ...otherProps }) => {
  if (!data) return null;
  const { actor, others, text } = parseNotificationData(data.activities);

  return (
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
          <Text style={[styles.activityText, styles.activityTextHighlight]}>
            {actor && actor.name}{' '}
          </Text>
          <Text style={styles.activityText}>
            {others && <Text>and {others}</Text>}
            <Text style={styles.modalText}>{text}</Text>
          </Text>
        </View>
      </View>
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
