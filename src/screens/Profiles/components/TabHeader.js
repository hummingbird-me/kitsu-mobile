import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import glamorous from 'glamorous-native';
import { StyledText } from 'kitsu/screens/Profiles/parts';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

const Container = glamorous.view(
  {
    paddingTop: scenePadding,
    paddingBottom: scenePadding,
    paddingHorizontal: scenePadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
);

const TitleText = props => <StyledText size="xsmall" bold {...props} />;

const TabHeader = ({
  padded,
  contentDark,
  title,
  actionOnPress,
  actionTitle,
}) => (
  <Container padded={padded}>
    <TitleText color={contentDark ? 'dark' : 'lightGrey'}>{title}</TitleText>
    {(actionTitle && actionOnPress) && (
      <TouchableOpacity onPress={actionOnPress}>
        <TitleText color="yellow">{actionTitle}</TitleText>
      </TouchableOpacity>
    )}
  </Container>
);

TabHeader.propTypes = {
  padded: PropTypes.bool,
  contentDark: PropTypes.bool,
  actionOnPress: PropTypes.func,
  actionTitle: PropTypes.string,
  title: PropTypes.string,
};

TabHeader.defaultProps = {
  padded: false,
  contentDark: false,
  actionOnPress: null,
  actionTitle: null,
  title: '',
};

export default TabHeader;
