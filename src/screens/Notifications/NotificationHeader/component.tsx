import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import * as colors from 'kitsu/constants/colors';

import { styles } from './styles';

interface NotificationHeaderProps {
  unreadCount: number;
  markingRead: boolean;
  onMarkAll(...args: unknown[]): unknown;
}

export const NotificationHeader = ({
  unreadCount,
  markingRead,
  onMarkAll,
}: NotificationHeaderProps) => (
  <View style={styles.customHeaderWrapper}>
    <Text style={styles.customHeaderText}>Notifications</Text>
    {unreadCount > 0 && (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onMarkAll}
        style={styles.customHeaderButton}
      >
        {markingRead ? (
          <ActivityIndicator color={colors.offBlack} />
        ) : (
          <Text style={styles.customHeaderButtonText}>Mark all as read</Text>
        )}
      </TouchableOpacity>
    )}
  </View>
);
