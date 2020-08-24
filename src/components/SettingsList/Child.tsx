import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as colors from 'app/constants/colors';
import { OpenSans } from 'app/constants/fonts';

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
        <Ionicons
          style={{ marginRight: 2 }}
          name={'ios-arrow-forward'}
          color={colors.lightGrey}
          size={16}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 44,
    backgroundColor: colors.white,
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
    fontSize: 12,
    marginLeft: 6,
    color: colors.softBlack,
  },
});
