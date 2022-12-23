import { isEmpty } from 'lodash';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { StyledText } from 'kitsu/components/StyledText';

import { styles } from './styles';

const TitleText = (props) => <StyledText size="xsmall" bold {...props} />;

interface TabHeaderProps {
  contentDark?: boolean;
  actionOnPress?(...args: unknown[]): unknown;
  actionTitle?: string;
  title?: string;
}

export const TabHeader = ({
  contentDark,
  title,
  actionOnPress,
  actionTitle,
}: TabHeaderProps) => (
  <View style={styles.wrap}>
    <TitleText color={contentDark ? 'dark' : 'lightGrey'}>{title}</TitleText>
    {!isEmpty(actionTitle) && (
      <TouchableOpacity onPress={actionOnPress}>
        <TitleText color="yellow">{actionTitle}</TitleText>
      </TouchableOpacity>
    )}
  </View>
);

TabHeader.defaultProps = {
  contentDark: false,
  actionOnPress: null,
  actionTitle: null,
  title: '',
};
