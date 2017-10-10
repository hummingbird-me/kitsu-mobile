import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import Avatar from 'kitsu/screens/Profiles/components/Avatar';
import { StyledText } from 'kitsu/screens/Profiles/parts';

const Container = glamorous.view(
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
);

const AvatarContainer = glamorous.view({
  marginRight: 7,
});

const Main = glamorous.view({
  flex: 1,
});

const Side = glamorous.view({
  alignSelf: 'flex-end',
});

const AvatarHeader = ({ avatar, title, subtitle, sideElement }) => (
  <Container>
    <AvatarContainer>
      <Avatar avatar={avatar} />
    </AvatarContainer>
    <Main>
      <StyledText color="dark" size="small">{title}</StyledText>
      <StyledText color="grey" size="xxsmall">{subtitle}</StyledText>
    </Main>
    {sideElement && (
      <Side>{sideElement}</Side>
    )}
  </Container>
);

AvatarHeader.propTypes = {
  avatar: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  sideElement: PropTypes.element,
};

AvatarHeader.defaultProps = {
  avatar: '',
  title: '',
  subtitle: '',
  sideElement: null,
};

export default AvatarHeader;
