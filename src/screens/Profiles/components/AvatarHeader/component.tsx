import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Avatar } from 'kitsu/screens/Profiles/components/Avatar';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const AvatarHeader = ({ avatar, title, subtitle, sideElement, boxed, numberOfLinesTitle }) => (
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

AvatarHeader.propTypes = {
  avatar: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  sideElement: PropTypes.element,
  boxed: PropTypes.bool,
  numberOfLinesTitle: PropTypes.number,
};

AvatarHeader.defaultProps = {
  avatar: null,
  title: '',
  subtitle: '',
  sideElement: null,
  boxed: undefined,
  numberOfLinesTitle: undefined,
};
