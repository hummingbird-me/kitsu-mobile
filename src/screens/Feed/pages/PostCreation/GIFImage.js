import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import { scene } from 'kitsu/screens/Feed/constants';
import Icon from 'react-native-vector-icons/FontAwesome';

export const GIFImage = ({ uri, onClear, disabled }) => (
  <View>
    <PostImage uri={uri} width={scene.width} />
    <TouchableOpacity
      onPress={onClear}
      style={{
        position: 'absolute',
        right: 5,
        top: 5,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
      disabled={disabled}
    >
      <Icon name="close" style={{ color: colors.lightGrey, fontSize: 18 }} />
    </TouchableOpacity>
  </View>
);

GIFImage.propTypes = {
  uri: PropTypes.string.isRequired,
  onClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

GIFImage.defaultProps = {
  disabled: false,
};
