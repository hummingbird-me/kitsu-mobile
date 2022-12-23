import React from 'react';
import { View } from 'react-native';
import { MediaTag } from 'kitsu/screens/Feed/components/MediaTag';
import { styles } from './styles';
import { Spoiler } from './Overlays/Spoiler';
import { NotSafeForWork } from './Overlays/NotSafeForWork';
import { NSFWandSpoiler } from './Overlays/NSFWandSpoiler';
import { PostStatus } from '../PostStatus';

interface PostOverlayProps {
  nsfw?: boolean;
  spoiler?: boolean;
  componentId: any;
  likesCount?: number;
  commentsCount?: number;
  taggedMedia?: object;
  taggedEpisode?: object;
  onPress?(...args: unknown[]): unknown;
}

export const PostOverlay = ({
  nsfw,
  spoiler,
  onPress,
  taggedMedia,
  taggedEpisode,
  likesCount,
  commentsCount,
  componentId
}: PostOverlayProps) => {
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
          componentId={componentId}
        />
      )}
      <PostStatus likesCount={likesCount} commentsCount={commentsCount} />
    </View>
  );
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
