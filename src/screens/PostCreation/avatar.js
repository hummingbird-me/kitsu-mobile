import React from 'react';
import { Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});

export default props => <Image style={styles.avatar} {...props} />;
