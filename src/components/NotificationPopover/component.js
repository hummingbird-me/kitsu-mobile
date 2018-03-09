import React from 'react';
import { View, ViewPropTypes, Text, StatusBar, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { PropTypes } from 'prop-types';
import { parseNotificationData } from 'kitsu/screens/Notifications/NotificationsScreen';
import { styles } from './styles';

export const NotificationPopover = ({ style, onRequestClose, data }) => {
  if (!data) return null;
  const { actorName, actorAvatar, others, text } = parseNotificationData(data.activities);

  return (
    <View style={style}>
      <TouchableOpacity activeOpacity={1} onPress={onRequestClose} style={styles.wrapper}>
        <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0.3)'} barStyle={'light-content'} />
        <TouchableOpacity activeOpacity={0.9} onPress={onRequestClose} style={styles.content}>
          <View style={{ paddingRight: 10 }}>
            <FastImage style={styles.userAvatar} source={{ uri: actorAvatar }} borderRadius={20} />
          </View>
          <Text style={[styles.activityText, styles.activityTextHighlight]}>
            {actorName || 'Unknown'}
          </Text>
          <Text style={styles.activityText}>
            {others && <Text>and {others}</Text>}
            <Text style={styles.text}>{text}</Text>
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

NotificationPopover.propTypes = {
  style: ViewPropTypes.style,
  data: PropTypes.object,
  onRequestClose: PropTypes.func.isRequired,
};
NotificationPopover.defaultProps = {
  style: null,
  data: null,
};
