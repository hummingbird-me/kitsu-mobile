import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { upperFirst } from 'lodash';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { StyledText } from 'kitsu/components/StyledText';
import * as Layout from 'kitsu/screens/Feed/components/Layout';

const styles = StyleSheet.create({
  container: {
    // padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    paddingRight: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightGrey,
    borderRadius: 4,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  icon: {
    color: colors.lightGrey,
    fontSize: 18,
  },
  image: {
    width: 60,
    height: 90,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
  },
});

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
