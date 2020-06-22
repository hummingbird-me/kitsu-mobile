import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';
import PropTypes from 'prop-types';
import { Comment } from 'app/screens/Feed/components/Comment';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'app/navigation';

export class CommentFlatList extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    hideEmbeds: PropTypes.bool,
    latestComments: PropTypes.array.isRequired,
    componentId: PropTypes.any.isRequired,
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
