import React from 'react';
import { View } from 'react-native';
import { Avatar } from 'kitsu/screens/Profiles/components/Avatar';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

interface AvatarHeaderProps {
  avatar?: string;
  title?: string;
  subtitle?: string;
  sideElement?: React.ReactElement;
  boxed?: boolean;
  numberOfLinesTitle?: number;
}

export const AvatarHeader = ({
  avatar,
  title,
  subtitle,
  sideElement,
  boxed,
  numberOfLinesTitle
}: AvatarHeaderProps) => (
  <View style={styles.wrap}>
    <Avatar avatar={avatar} />
    <View style={styles.main}>
      <StyledText color="dark" size="small" numberOfLines={numberOfLinesTitle}>{title}</StyledText>
      <StyledText color="grey" size="xxsmall" numberOfLines={(boxed && 1) || undefined}>{subtitle}</StyledText>
    </View>
    {sideElement && (
      <View style={styles.side}>
        {sideElement}
      </View>
    )}
  </View>
);

AvatarHeader.defaultProps = {
  avatar: null,
  title: '',
  subtitle: '',
  sideElement: null,
  boxed: undefined,
  numberOfLinesTitle: undefined,
};
