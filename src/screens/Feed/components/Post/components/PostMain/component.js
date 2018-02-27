import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { StyledText, ViewMoreStyledText } from 'kitsu/components/StyledText';
import { MediaTag } from 'kitsu/screens/Feed/components/MediaTag';
import { scene } from 'kitsu/screens/Feed/constants';
import Hyperlink from 'react-native-hyperlink';
import { isEmpty } from 'lodash';
import { EmbeddedContent } from 'kitsu/screens/Feed/components/EmbeddedContent';
import { handleURL } from 'kitsu/common/utils/url';
import { styles } from './styles';
import { PostStatus } from '../PostStatus';

export const PostMain = ({
  content,
  embed,
  likesCount,
  commentsCount,
  taggedMedia,
  taggedEpisode,
  navigation,
  onPress,
}) => {
  const hasContentAbove = !isEmpty(content) || taggedMedia;
  return (
    <View style={styles.postMain}>
      {!isEmpty(content) &&
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.postContent}>
            <Hyperlink linkStyle={styles.linkStyle} onPress={url => handleURL(url, navigation)}>
              <ViewMoreStyledText color="dark" textStyle={{ lineHeight: null }} size="small" selectable numberOfLines={8}>{content}</ViewMoreStyledText>
            </Hyperlink>
          </View>
        </TouchableWithoutFeedback>
      }
      {taggedMedia && (
        <MediaTag
          media={taggedMedia}
          episode={taggedEpisode}
          navigation={navigation}
          style={isEmpty(content) ? { marginTop: 0 } : null}
        />
      )}
      {embed &&
        <EmbeddedContent
          embed={embed}
          maxWidth={scene.width}
          minWidth={scene.width}
          style={[styles.postImagesView, !hasContentAbove && styles.postImagesView_noText]}
          navigation={navigation}
        />
      }
      <PostStatus onPress={onPress} likesCount={likesCount} commentsCount={commentsCount} />
    </View>
  );
};

PostMain.propTypes = {
  content: PropTypes.string,
  embed: PropTypes.object,
  likesCount: PropTypes.number,
  commentsCount: PropTypes.number,
  taggedMedia: PropTypes.object,
  taggedEpisode: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  onPress: PropTypes.func,
};
PostMain.defaultProps = {
  content: null,
  embed: null,
  likesCount: 0,
  commentsCount: 0,
  taggedMedia: null,
  taggedEpisode: null,
  onPress: null,
};
