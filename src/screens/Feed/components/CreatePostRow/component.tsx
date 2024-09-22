import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { StyledText } from '@/components/StyledText';
import AvatarImage from '@/components/content/AvatarImage';
import { useAccount } from '@/contexts/AccountContext';
import * as Layout from '@/screens/Feed/components/Layout';

import { styles } from './styles';

type CreatePostRowComponentProps = {
  targetUser?: {
    id?: string;
    name?: string;
  };
  onPress?(...args: unknown[]): unknown;
  title?: string;
  style?: object;
};

export default function CreatePostRowComponent({
  targetUser,
  onPress,
  title,
  style,
}: CreatePostRowComponentProps) {
  const { profile, id: userId } = useAccount();
  const defaultTitle = `Want to share an update, ${profile.name}?`;
  const shareTitle = `Share an update with ${
    targetUser ? targetUser.name : 'Someone'
  }`;
  const isTargetCurrentUser = targetUser ? targetUser.id === userId : true;

  return (
    <View style={[styles.wrap, style]}>
      <TouchableOpacity onPress={onPress}>
        <Layout.RowWrap alignItems="center">
          <AvatarImage source={profile.avatarImage} size={20} />
          <Layout.RowMain>
            <StyledText color="grey" size="xsmall">
              {title || (isTargetCurrentUser ? defaultTitle : shareTitle)}
            </StyledText>
          </Layout.RowMain>
        </Layout.RowWrap>
      </TouchableOpacity>
    </View>
  );
}
