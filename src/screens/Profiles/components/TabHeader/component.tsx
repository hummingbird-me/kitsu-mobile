import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { isEmpty } from 'lodash';
import { styles } from './styles';

const TitleText = props => <StyledText size="xsmall" bold {...props} />;

export const TabHeader = ({
  contentDark,
  title,
  actionOnPress,
  actionTitle,
}) => (
  <View style={styles.wrap}>
    <TitleText color={contentDark ? 'dark' : 'lightGrey'}>{title}</TitleText>
    {!isEmpty(actionTitle) && (
      <TouchableOpacity onPress={actionOnPress}>
        <TitleText color="yellow">{actionTitle}</TitleText>
      </TouchableOpacity>
    )}
  </View>
);

TabHeader.propTypes = {
  contentDark: PropTypes.bool,
  actionOnPress: PropTypes.func,
  actionTitle: PropTypes.string,
  title: PropTypes.string,
};

TabHeader.defaultProps = {
  contentDark: false,
  actionOnPress: null,
  actionTitle: null,
  title: '',
};
