import React from 'react';
import PropTypes from 'prop-types';
import { PostCreator } from 'app/screens/Feed/components/PostCreator';
import { Navigation } from 'react-native-navigation';

export default class CreatePost extends React.PureComponent {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
    targetUser: PropTypes.object,
    spoiledUnit: PropTypes.object,
    nsfw: PropTypes.bool,
    spoiler: PropTypes.bool,
    media: PropTypes.object,
    post: PropTypes.object,
    onPostCreated: PropTypes.func,
    disableMedia: PropTypes.bool,
  }

  static defaultProps = {
    targetUser: null,
    spoiledUnit: null,
    nsfw: false,
    spoiler: false,
    media: null,
    post: null,
    disableMedia: false,
    onPostCreated: null,
  }

  render() {
    const {
      componentId,
      targetUser,
      spoiledUnit,
      nsfw,
      spoiler,
      media,
      post,
      onPostCreated,
      disableMedia,
    } = this.props;

    return (
      <PostCreator
        onPostCreated={(newPost) => {
          if (onPostCreated) onPostCreated(newPost);
          Navigation.dismissModal(componentId);
        }}
        onCancel={() => Navigation.dismissModal(componentId)}
        post={post}
        media={media}
        spoiledUnit={spoiledUnit}
        targetUser={targetUser}
        disableMedia={!!disableMedia}
        spoiler={!!spoiler}
        nsfw={!!nsfw}
      />
    );
  }
}
