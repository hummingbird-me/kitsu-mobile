import React from 'react';
import { View } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import { DropdownPill } from 'kitsu/screens/Feed/components/DropdownPill';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { isEmpty } from 'lodash';
import { styles } from './styles';

interface PostMetaProps {
  avatar?: string;
  author?: string;
  targetName?: string;
  feedTitle?: string;
}

export const PostMeta = ({
  avatar,
  author,
  targetName,
  feedTitle
}: PostMetaProps) => (
  <View style={styles.postMeta}>
    <Layout.RowWrap alignItems="center">
      <Avatar avatar={avatar} />
      <Layout.RowMain>
        <StyledText color="dark" size="xsmall" bold>{author}</StyledText>
        { !isEmpty(targetName) &&
          <StyledText color="dark" size="xxsmall">To {targetName}</StyledText>
        }
      </Layout.RowMain>
    </Layout.RowWrap>
  </View>
);

PostMeta.defaultProps = {
  avatar: null,
  author: '',
  feedTitle: '',
  targetName: '',
};
