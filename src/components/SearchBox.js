import React from 'react';
import { StyleSheet } from 'react-native';
import { connectSearchBox } from 'react-instantsearch/connectors';
import * as colors from 'kitsu/constants/colors';
import { Item, Input, Icon } from 'native-base';

export default connectSearchBox(({ refine, currentRefinement, placeholder }) => (
  <Item style={styles.searchBoxContainer}>
    <Icon name="ios-search" style={styles.searchBoxIcon} />
    <Input
      placeholder={placeholder}
      value={currentRefinement}
      onChangeText={t => refine(t)}
      style={styles.searchBoxInput}
      autoCapitalize={'none'}
      autoCorrect={false}
      underlineColorAndroid={'transparent'}
      placeholderTextColor={colors.placeholderGrey}
      keyboardAppearance={'dark'}
    />
  </Item>
));

const styles = {
  searchBoxContainer: {
    height: 36,
    backgroundColor: colors.white,
    paddingLeft: 14,
    paddingRight: 14,
    borderColor: colors.imageGrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 9,
    marginRight: 9,
    borderRadius: 2,
  },
  searchBoxInput: {
    fontSize: 13,
    fontFamily: 'OpenSans',
    color: colors.placeholderGrey,
    alignSelf: 'center',
    textAlign: 'center',
  },
  searchBoxIcon: {
    color: '#9D9D9D',
    fontSize: 17,
    alignItems: 'center',
    marginTop: 5,
  },
};
