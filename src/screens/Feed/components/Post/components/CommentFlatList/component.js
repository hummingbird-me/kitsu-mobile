import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import { Comment } from 'kitsu/screens/Feed/components/Comment';

export class CommentFlatList extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    hideEmbeds: PropTypes.bool,
    latestComments: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
    overlayColor: PropTypes.string,
    isTruncated: PropTypes.bool,
  }

  static defaultProps = {
    hideEmbeds: false,
    overlayColor: null,
    isTruncated: false,
  }

  render() {
    const {
      post,
      hideEmbeds,
      navigation,
      latestComments,
      overlayColor,
      isTruncated,
    } = this.props;
    return (
      <FlatList
        data={latestComments}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <Comment
            post={post}
            comment={item}
            onAvatarPress={id => navigation.navigate('ProfilePages', { userId: id })}
            isTruncated={isTruncated}
            overlayColor={overlayColor}
            hideEmbeds={hideEmbeds}
            navigation={navigation}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 17 }} />}
      />
    );
  }
}
