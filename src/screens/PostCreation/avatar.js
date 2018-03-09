import React from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});

export default props => <FastImage style={styles.avatar} {...props} />;
