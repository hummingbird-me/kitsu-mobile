import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import { scene } from 'kitsu/screens/Feed/constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import { gifImageStyles as styles } from './styles';

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
