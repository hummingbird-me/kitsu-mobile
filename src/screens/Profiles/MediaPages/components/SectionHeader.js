import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import glamorous, { View } from 'glamorous-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { listBackPurple } from 'kitsu/constants/colors';
import { StyledText } from '../parts';
import { scenePadding } from '../constants';

const Container = glamorous.view(
  {
    paddingHorizontal: scenePadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
);

const StyledLink = glamorous(TouchableOpacity)({
  flexDirection: 'row',
  alignItems: 'center',
});

const StyledIcon = glamorous(Icon)(
  {
    fontSize: 17,
    marginLeft: 7,
  },
  ({ contentDark }) => ({
    color: contentDark ? listBackPurple : '#FFFFFF',
  }),
);

const TitleText = props => <StyledText size="xsmall" bold {...props} />;

const SectionHeader = ({
  contentDark,
  title,
  titleAction,
  titleLabel,
  onViewAllPress,
}) => (
  <Container>
    <View flexDirection="row">
      <TitleText color={contentDark ? 'dark' : 'lightGrey'}>{title}</TitleText>
      {(titleAction && titleLabel) && (
        <StyledLink onPress={titleAction}>
          <TitleText color={contentDark ? 'dark' : 'light'}>・</TitleText>
          <TitleText color={contentDark ? 'yellow' : 'yellow'}>{titleLabel}</TitleText>
        </StyledLink>
      )}
    </View>
    {onViewAllPress && (
      <StyledLink onPress={onViewAllPress}>
        <StyledText color={contentDark ? 'dark' : 'light'} size="xsmall" bold>View All</StyledText>
        <StyledIcon contentDark={contentDark} name="ios-arrow-forward" />
      </StyledLink>
    )}
  </Container>
);

SectionHeader.propTypes = {
  contentDark: PropTypes.bool,
  onViewAllPress: PropTypes.func,
  title: PropTypes.string,
  titleAction: PropTypes.element,
  titleLabel: PropTypes.string,
};

SectionHeader.defaultProps = {
  contentDark: false,
  onViewAllPress: null,
  title: '',
  titleAction: null,
  titleLabel: '',
};

export default SectionHeader;
