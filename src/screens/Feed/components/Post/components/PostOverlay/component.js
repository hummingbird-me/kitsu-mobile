import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { MediaTag } from 'kitsu/screens/Feed/components/MediaTag';
import { styles } from './styles';
import { Spoiler } from './Overlays/Spoiler';
import { NotSafeForWork } from './Overlays/NotSafeForWork';
import { NSFWandSpoiler } from './Overlays/NSFWandSpoiler';
import { PostStatus } from '../PostStatus';

export const PostOverlay = ({
  nsfw,
  spoiler,
  onPress,
  taggedMedia,
  taggedEpisode,
  likesCount,
  commentsCount,
  navigation,
}) => {
  let postOverlay = <View />;

  if (spoiler && nsfw) {
    postOverlay = <NSFWandSpoiler onPress={onPress} />;
  } else if (spoiler) {
    postOverlay = <Spoiler onPress={onPress} />;
  } else if (nsfw) {
    postOverlay = <NotSafeForWork onPress={onPress} />;
  }

  return (
    <View style={styles.postMain}>
      {postOverlay}
      {taggedMedia && (
        <MediaTag
          media={taggedMedia}
          episode={taggedEpisode}
          navigation={navigation}
        />
      )}
      <PostStatus likesCount={likesCount} commentsCount={commentsCount} />
    </View>
  );
};

PostOverlay.propTypes = {
  nsfw: PropTypes.bool,
  spoiler: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
  likesCount: PropTypes.number,
  commentsCount: PropTypes.number,
  taggedMedia: PropTypes.object,
  taggedEpisode: PropTypes.object,
  onPress: PropTypes.func,
};

PostOverlay.defaultProps = {
  likesCount: 0,
  commentsCount: 0,
  taggedMedia: null,
  taggedEpisode: null,
  onPress: null,
  nsfw: false,
  spoiler: false,
};
