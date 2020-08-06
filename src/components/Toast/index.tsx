import React from 'react';
import { View, ViewStyle, Text, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from './styles';

export const Toast = ({
  style = {},
  visible = false,
  title,
  onRequestClose,
  onDismiss,
  ...otherProps
}: {
  style?: ViewStyle;
  visible: boolean;
  title: string;
  onRequestClose?: () => {};
  onDismiss?: () => {};
  [key: string]: any;
}) => {
  const { bottom } = useSafeAreaInsets();
  const marginBottom = Math.max(bottom, styles.contentContainer.margin);
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}
      {...otherProps}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalContainer}
        onPress={onDismiss}>
        <View style={[styles.contentContainer, style, { marginBottom }]}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
