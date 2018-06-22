import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { StyledText } from 'kitsu/components/StyledText';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { isEmpty } from 'lodash';
import { mediaItemStyles as styles } from './styles';

export const MediaItem = ({ media, episode, onClear, disabled }) => {
  const episodePrefix = media.type === 'manga' ? 'CH' : 'EP';
  const episodeTitle = (episode && !isEmpty(episode.canonicalTitle) && `- ${episode.canonicalTitle}`) || '';

  return (
    <View style={styles.container}>
      <Layout.RowWrap alignItems="center">
        <ProgressiveImage
          source={{ uri: media && media.posterImage && media.posterImage.tiny }}
          style={[styles.image, episode && styles.image_episode]}
        />
        <Layout.RowMain>
          <StyledText color="dark" size="small" numberOfLines={2} bold>{media.canonicalTitle || 'Title'}</StyledText>
          <StyledText color="dark" size="xsmall" numberOfLines={3}>{media.synopsis || 'Synopsis'}</StyledText>
        </Layout.RowMain>
        {!disabled &&
          <TouchableOpacity
            onPress={onClear}
            style={styles.iconContainer}
            disabled={disabled}
          >
            <Icon name="close" style={styles.icon} />
          </TouchableOpacity>
        }
      </Layout.RowWrap>
      {episode && (
        <View style={styles.episodeTag}>
          <StyledText
            color="dark"
            size="xsmall"
            numberOfLines={1}
          >
            {`${episodePrefix} ${episode.number} ${episodeTitle}`}
          </StyledText>
        </View>
      )}
    </View>
  );
};

MediaItem.propTypes = {
  media: PropTypes.object.isRequired,
  onClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  episode: PropTypes.shape({
    number: PropTypes.number.isRequired,
  }),
};

MediaItem.defaultProps = {
  disabled: false,
  episode: null,
};
