import React from 'react';
import { Navigation } from 'react-native-navigation';

import { PostCreator } from 'kitsu/screens/Feed/components/PostCreator';

interface CreatePostProps {
  componentId: any;
  targetUser?: object;
  spoiledUnit?: object;
  nsfw?: boolean;
  spoiler?: boolean;
  media?: object;
  post?: object;
  onPostCreated?(...args: unknown[]): unknown;
  disableMedia?: boolean;
}

export default class CreatePost extends React.PureComponent<CreatePostProps> {
  static defaultProps = {
    targetUser: null,
    spoiledUnit: null,
    nsfw: false,
    spoiler: false,
    media: null,
    post: null,
    disableMedia: false,
    onPostCreated: null,
  };

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
