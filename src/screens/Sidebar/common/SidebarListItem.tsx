import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';

import * as colors from 'kitsu/constants/colors';

interface ItemSeparatorProps {
  underlineImage?: boolean;
}

export const ItemSeparator = ({ underlineImage }: ItemSeparatorProps) => {
  if (!underlineImage) {
    return (
      // done to show white border under image (when list has non-white background)
      <View
        style={{
          flexDirection: 'row',
          height: StyleSheet.hairlineWidth,
          backgroundColor: colors.lightGrey,
        }}
      >
        <View style={{ width: 38, backgroundColor: colors.white }} />
        <View />
      </View>
    );
  }
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.lightGrey,
      }}
    />
  );
};

ItemSeparator.defaultProps = {
  underlineImage: true,
};

interface SidebarListItemProps {
  title: string;
  image?: number;
  imageURL?: string;
  onPress?(...args: unknown[]): unknown;
  style?: object | number;
}

export const SidebarListItem = ({
  image,
  imageURL,
  title,
  onPress,
  style,
}: SidebarListItemProps) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.item, style]}
  >
    <View style={styles.leftContentWrapper}>
      {(image && (
        <FastImage
          source={image}
          style={styles.image}
          resizeMode="contain"
          cache="web"
        />
      )) ||
        (imageURL && (
          <FastImage
            source={{ uri: imageURL }}
            style={[styles.image, { borderRadius: 4 }]}
            resizeMode="stretch"
            cache="web"
          />
        ))}
      <Text style={styles.text}>{title}</Text>
    </View>
    <View>
      <Icon
        style={{ marginRight: 2 }}
        name={'ios-arrow-forward'}
        color={colors.lightGrey}
        size={16}
      />
    </View>
  </TouchableOpacity>
);

SidebarListItem.defaultProps = {
  title: 'Settings',
  image: null,
  imageURL: null,
  onPress: null,
  style: null,
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flex: 1,
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
    fontFamily: 'OpenSans',
    fontSize: 12,
    marginLeft: 6,
    color: colors.softBlack,
  },
});
