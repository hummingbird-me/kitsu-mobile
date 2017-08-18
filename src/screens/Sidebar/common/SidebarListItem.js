import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Icon, Left, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from '../../../constants/colors';

export const LeftIconWrapper = ({ children }) => (
  // have a standard width at all items.
  <View style={{ width: 25, alignItems: 'center' }}>
    {children}
  </View>
);

export const ItemSeparator = () => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.imageGrey }} />
);


const SidebarListItem = ({ image, title, onPress }) => (
  <Item button onPress={onPress} style={styles.sectionListItem}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <LeftIconWrapper>
        <Image source={image} style={{ resizeMode: 'contain', width: 16, height: 16, borderRadius: 4 }} />
      </LeftIconWrapper>
      <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 8, color: '#444' }}>{title}</Text>
    </View>
    <Right>
      <Icon name={'ios-arrow-forward'} style={{ color: colors.lightGrey, fontSize: 16 }} />
    </Right>
  </Item>
);

SidebarListItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.number.isRequired,
  onPress: PropTypes.func,
};

SidebarListItem.defaultProps = {
  title: 'Settings',
};

const styles = {
  sectionListItem: {
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 0,
    borderColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
    marginLeft: 0 // FUCKING STUPID NATIVEBASE.
  },
};

export default SidebarListItem;