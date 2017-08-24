import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Icon, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';

// have a standard width at all items.
export const WidthFixer = ({ children }) => (
  <View style={{ width: 25, alignItems: 'center' }}>
    {children}
  </View>
);

export const ItemSeparator = () => (
  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.lightGrey }} />
);

const SidebarListItem = ({ image, title, onPress }) => (
  <Item button onPress={onPress} style={styles.sectionListItem}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <WidthFixer>
        <Image
          source={image}
          style={{ resizeMode: 'contain', width: 16, height: 16, borderRadius: 4 }}
        />
      </WidthFixer>
      <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginLeft: 8, color: '#444' }}>
        {title}
      </Text>
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
    marginLeft: 0, // NATIVEBASE.
  },
};

export default SidebarListItem;
