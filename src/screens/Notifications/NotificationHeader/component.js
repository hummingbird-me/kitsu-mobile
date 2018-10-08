import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

export const NotificationHeader = ({ unreadCount, markingRead, onMarkAll }) => (
  <View style={styles.customHeaderWrapper}>
    <Text style={styles.customHeaderText}>Notifications</Text>
    {unreadCount > 0 && (
      <TouchableOpacity activeOpacity={0.8} onPress={onMarkAll} style={styles.customHeaderButton}>
        {markingRead ? (
          <ActivityIndicator color={colors.offBlack} />
        ) : (
          <Text style={styles.customHeaderButtonText}>Mark all as read</Text>
        )}
      </TouchableOpacity>
    )}
  </View>
);

NotificationHeader.propTypes = {
  unreadCount: PropTypes.number.isRequired,
  markingRead: PropTypes.bool.isRequired,
  onMarkAll: PropTypes.func.isRequired,
};
