import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { StyledText, ViewMoreStyledText } from 'kitsu/components/StyledText';
import { MediaTag } from 'kitsu/screens/Feed/components/MediaTag';
import { scene } from 'kitsu/screens/Feed/constants';
import Hyperlink from 'react-native-hyperlink';
import { isEmpty } from 'lodash';
import { EmbeddedContent } from 'kitsu/screens/Feed/components/EmbeddedContent';
import { handleURL } from 'kitsu/utils/url';
import { styles } from './styles';
import { PostStatus } from '../PostStatus';

interface PostMainProps {
  cacheKey?: string;
  content?: string;
  embed?: object;
  uploads?: object[];
  likesCount?: number;
  commentsCount?: number;
  taggedMedia?: object;
  taggedEpisode?: object;
  componentId: any;
  onPress?(...args: unknown[]): unknown;
  onStatusPress?(...args: unknown[]): unknown;
  showViewParent?: boolean;
}

export const PostMain = ({
  cacheKey,
  content,
  embed,
  uploads,
  likesCount,
  commentsCount,
  taggedMedia,
  taggedEpisode,
  componentId,
  onPress,
  onStatusPress,
  showViewParent
}: PostMainProps) => {
  const hasContentAbove = !isEmpty(content) || taggedMedia;
  return (
    <View style={styles.postMain}>
      {!isEmpty(content) &&
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.postContent}>
            <Hyperlink linkStyle={styles.linkStyle} onPress={url => handleURL(url)}>
              <ViewMoreStyledText
                cacheKey={cacheKey}
                color="dark"
                textStyle={{ lineHeight: null }}
                size="small"
                selectable
                numberOfLines={8}
              >
                {content}
              </ViewMoreStyledText>
            </Hyperlink>
          </View>
        </TouchableWithoutFeedback>
      }
      {taggedMedia && (
        <MediaTag
          media={taggedMedia}
          episode={taggedEpisode}
          componentId={componentId}
          style={isEmpty(content) ? { marginTop: 0 } : null}
        />
      )}
      {(embed || !isEmpty(uploads)) &&
        <EmbeddedContent
          embed={embed}
          uploads={uploads}
          maxWidth={scene.width}
          minWidth={scene.width}
          style={[styles.postImagesView, !hasContentAbove && styles.postImagesView_noText]}
          componentId={componentId}
        />
      }
      <PostStatus onPress={onStatusPress || onPress} likesCount={likesCount} commentsCount={commentsCount} showViewParent={showViewParent}/>
    </View>
  );
};

PostMain.defaultProps = {
  cacheKey: null,
  content: null,
  embed: null,
  uploads: null,
  likesCount: 0,
  commentsCount: 0,
  taggedMedia: null,
  taggedEpisode: null,
  onPress: null,
  onStatusPress: null,
  showViewParent: false,
};
