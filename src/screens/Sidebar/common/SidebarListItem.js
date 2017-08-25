import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Right } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';

// have a standard width independent from icon/image width.
export const WidthFixer = ({ children }) => (
  <View style={{ width: 25, alignItems: 'center' }}>
    {children}
  </View>
);

export const ItemSeparator = () => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.lightGrey }} />
);

const SidebarListItem = ({ image, imageURL, title, onPress }) => (
  <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.item}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <WidthFixer>
        {(image && <Image source={image} style={styles.image} />) ||
          (imageURL &&
            <Image source={{ uri: imageURL }} style={[styles.image, { resizeMode: 'stretch' }]} />)}
      </WidthFixer>
      <Text style={styles.text}>
        {title}
      </Text>
    </View>
    <Right>
      <Icon
        name={'ios-arrow-forward'}
        style={{ color: colors.lightGrey, fontSize: 16, marginRight: 2 }}
      />
    </Right>
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
  image: {
    resizeMode: 'contain',
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  text: {
    fontFamily: 'OpenSans',
    fontSize: 12,
    marginLeft: 8,
    color: '#444',
  },
});

export default SidebarListItem;
