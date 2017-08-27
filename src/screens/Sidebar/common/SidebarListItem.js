import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';

export const ItemSeparator = () => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.lightGrey }} />
);

export const SidebarListItem = ({ image, imageURL, title, onPress }) => (
  <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.item}>
    <View style={styles.leftContentWrapper}>
      {(image && <Image source={image} style={styles.image} />) ||
        (imageURL &&
          <Image
            source={{ uri: imageURL }}
            style={[styles.image, { resizeMode: 'stretch', borderRadius: 4 }]}
          />)}
      <Text style={styles.text}>
        {title}
      </Text>
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

SidebarListItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.number,
  onPress: PropTypes.func,
};

SidebarListItem.defaultProps = {
  title: 'Settings',
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
    resizeMode: 'contain',
    width: 16,
    height: 16,
    marginHorizontal: 4,
  },
  text: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    marginLeft: 6,
    color: colors.softBlack,
  },
});
