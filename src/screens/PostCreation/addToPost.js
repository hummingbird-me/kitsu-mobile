import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

export default () => (
  <View style={styles.actionsContainer}>
    <Text style={styles.actionHeading}>Add to your post</Text>
    <View style={styles.actions}>
      <FontAwesome name="image" style={[styles.actionItem, styles.actionImageIcon]} />
      <Text style={[styles.actionItem, styles.actionGIF]}>GIF</Text>
    </View>
  </View>
);
