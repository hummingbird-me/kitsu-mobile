import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';
import { Comment } from 'kitsu/screens/Feed/components/Comment';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';

interface CommentFlatListProps {
  post: object;
  hideEmbeds?: boolean;
  latestComments: unknown[];
  componentId: any;
  isTruncated?: boolean;
}

export class CommentFlatList extends PureComponent<CommentFlatListProps> {
  static defaultProps = {
    hideEmbeds: false,
    isTruncated: false,
  }

  render() {
    const {
      post,
      hideEmbeds,
      componentId,
      latestComments,
      isTruncated,
    } = this.props;
    return (
      <FlatList
        data={latestComments}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => (
          <Comment
            post={post}
            comment={item}
            onAvatarPress={id => Navigation.push(componentId, {
              component: {
                name: Screens.PROFILE_PAGE,
                passProps: { userId: id },
              },
            })}
            isTruncated={isTruncated}
            hideEmbeds={hideEmbeds}
            componentId={componentId}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 17 }} />}
      />
    );
  }
}
