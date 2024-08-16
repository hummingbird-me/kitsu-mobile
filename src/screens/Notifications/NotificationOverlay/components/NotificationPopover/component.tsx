import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { Image } from 'expo-image';
import { isEmpty } from 'lodash';
import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { parseNotificationData } from 'kitsu/utils/notifications';

import { styles } from './styles';

type NotificationPopoverProps = {
  style?: unknown;
  data?: object;
  onPress(...args: unknown[]): unknown;
};

export const NotificationPopover = ({
  style,
  onPress,
  data,
}: NotificationPopoverProps) => {
  if (!data) return null;
  const { actorName, actorAvatar, others, text } = parseNotificationData(
    data.activities
  );

  return (
    <View style={style}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={styles.wrapper}>
        <StatusBar
          translucent
          backgroundColor={'rgba(0, 0, 0, 0.3)'}
          barStyle={'light-content'}
        />
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={styles.content}>
          <View style={{ paddingRight: 10 }}>
            <Image style={styles.userAvatar} source={{ uri: actorAvatar }} />
          </View>
          <Text style={[styles.activityText, styles.activityTextHighlight]}>
            {actorName || 'Unknown'}{' '}
          </Text>
          <Text style={styles.activityText}>
            {!isEmpty(others) && <Text>and {others} </Text>}
            <Text style={styles.text}>{text}</Text>
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

NotificationPopover.propTypes = {
  style: ViewPropTypes.style,
};
NotificationPopover.defaultProps = {
  style: null,
  data: null,
};
