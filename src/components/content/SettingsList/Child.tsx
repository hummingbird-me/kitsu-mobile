import Ionicons from '@expo/vector-icons/Ionicons';
import React, { type ReactNode } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
  type ViewStyle,
} from 'react-native';

import { OpenSans } from '@/constants/fonts';
import { grey, white } from '@/constants/palette';

export default function SettingsListChild({
  image,
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  image?: ImageSourcePropType;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.item, style]}>
      <View style={styles.leftContentWrapper}>
        {image && (
          <Image source={image} style={styles.image} resizeMode="contain" />
        )}
        <Text style={styles.text}>{children}</Text>
      </View>
      <View>
        <Ionicons style={styles.chevron} name="chevron-forward-outline" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 44,
    backgroundColor: white,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 18,
    height: 18,
    marginHorizontal: 4,
  },
  text: {
    fontFamily: OpenSans.normal,
    fontSize: 14,
    marginLeft: 6,
    color: grey[7],
  },
  chevron: {
    marginRight: 2,
    color: grey[4],
    fontSize: 16,
  },
});
