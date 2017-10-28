import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import { DropdownPill } from 'kitsu/screens/Feed/components/DropdownPill';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { styles } from './styles';

export const PostMeta = ({ avatar, author, feedTitle, onFeedPillPress }) => (
  <View style={styles.postMeta}>
    <Layout.RowWrap alignItems="center">
      <Avatar avatar={avatar} />
      <Layout.RowMain>
        <StyledText color="dark" size="xsmall" bold>{author}</StyledText>
        <View style={styles.feedPill}>
          <DropdownPill title={feedTitle} onPress={onFeedPillPress} />
        </View>
      </Layout.RowMain>
    </Layout.RowWrap>
  </View>
);

PostMeta.propTypes = {
  avatar: PropTypes.string,
  author: PropTypes.string,
  feedTitle: PropTypes.string,
  onFeedPillPress: PropTypes.func,
};
PostMeta.defaultProps = {
  avatar: null,
  author: '',
  feedTitle: '',
  onFeedPillPress: null,
};
