import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import { scene } from 'kitsu/screens/Feed/constants';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    minHeight: 100,
  },
  iconContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  icon: {
    color: colors.white,
    fontSize: 14,
  },
});

export const GIFImage = ({ gif, onClear, disabled }) => (
  <View style={styles.container}>
    <PostImage
      uri={gif.images.original.url || ''}
      width={scene.width}
    />
    <TouchableOpacity
      onPress={onClear}
      style={styles.iconContainer}
      disabled={disabled}
    >
      <Icon name="close" style={styles.icon} />
    </TouchableOpacity>
  </View>
);

GIFImage.propTypes = {
  gif: PropTypes.shape({
    images: PropTypes.object.isRequired,
  }).isRequired,
  onClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

GIFImage.defaultProps = {
  disabled: false,
};
