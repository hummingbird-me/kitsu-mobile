import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { StyledText } from 'kitsu/components/StyledText';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { mediaItemStyles as styles } from './styles';

export const MediaItem = ({ media, onClear, disabled }) => (
  <View style={styles.container}>
    <Layout.RowWrap alignItems="center">
      <ProgressiveImage
        source={{ uri: media && media.posterImage && media.posterImage.tiny }}
        style={styles.image}
      />
      <Layout.RowMain>
        <StyledText color="dark" size="small" numberOfLines={2} bold>{media.canonicalTitle || 'Title'}</StyledText>
        <StyledText color="dark" size="xsmall" numberOfLines={3}>{media.synopsis || 'Synopsis'}</StyledText>
      </Layout.RowMain>
      <TouchableOpacity
        onPress={onClear}
        style={styles.iconContainer}
        disabled={disabled}
      >
        <Icon name="close" style={styles.icon} />
      </TouchableOpacity>
    </Layout.RowWrap>
  </View>
);

MediaItem.propTypes = {
  media: PropTypes.object.isRequired,
  onClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

MediaItem.defaultProps = {
  disabled: false,
};
