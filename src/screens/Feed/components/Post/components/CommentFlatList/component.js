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
    isTruncated: PropTypes.bool,
  }

  static defaultProps = {
    hideEmbeds: false,
    isTruncated: false,
  }

  render() {
    const {
      post,
      hideEmbeds,
      navigation,
      latestComments,
      isTruncated,
    } = this.props;
    return (
      <FlatList
        data={latestComments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Comment
            post={post}
            comment={item}
            onAvatarPress={id => navigation.navigate('ProfilePages', { userId: id })}
            isTruncated={isTruncated}
            hideEmbeds={hideEmbeds}
            navigation={navigation}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 17 }} />}
      />
    );
  }
}
