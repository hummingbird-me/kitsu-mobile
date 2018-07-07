import React from 'react';
import PropTypes from 'prop-types';
import { PostCreator } from 'kitsu/screens/Feed/components/PostCreator';

export default class CreatePost extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    const {
      targetUser,
      spoiledUnit,
      nsfw,
      spoiler,
      media,
      post,
      onPostCreated,
      disableMedia,
    } = navigation.state.params;

    return (
      <PostCreator
        onPostCreated={(newPost) => {
          onPostCreated(newPost);
          navigation.goBack(null);
        }}
        onCancel={() => navigation.goBack(null)}
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
