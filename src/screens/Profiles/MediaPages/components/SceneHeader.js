import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import glamorous, { View } from 'glamorous-native';
import { defaultAvatar, defaultCover } from 'kitsu/constants/app';
import { Button } from 'kitsu/components/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import { red, yellow, grey } from 'kitsu/constants/colors';
import { MaskedImage, StyledProgressiveImage, StyledText } from '../parts';
import ScrollableCategories from './ScrollableCategories';
import {
  scenePadding,
  cardSize,
  coverImageHeight,
  borderWidth,
  spacing,
} from '../constants';

const HeaderContainer = glamorous.view({
  marginTop: -20, // to cover the status bar in iOS
  backgroundColor: '#FFFFFF',
  paddingBottom: spacing.small,
});

const CoverImage = glamorous.view({
  width: '100%',
  height: coverImageHeight,
});

const ProfileHeader = glamorous.view({
  flexDirection: 'row',
  paddingHorizontal: scenePadding,
  marginTop: (cardSize.portraitLarge.height * -0.65),
});

const ProfileImageShadow = glamorous.view({
  borderRadius: 6,
  shadowColor: 'rgba(0,0,0,0.2)',
  shadowOffset: {
    width: 1,
    height: 1,
  },
  shadowOpacity: 1,
});

const ProfileImageContainer = glamorous.view({
  width: cardSize.portraitLarge.width,
  height: cardSize.portraitLarge.height,
  borderRadius: 6,
  borderWidth: 4 * borderWidth.hairline,
  borderColor: '#FFFFFF',
  overflow: 'hidden',
});

const TitleView = glamorous.view({
  flex: 1,
  height: cardSize.portraitLarge.height,
  marginLeft: scenePadding,
  position: 'relative',
});

const TitleTop = glamorous.view({
  justifyContent: 'flex-end',
  height: '65%',
  paddingBottom: scenePadding,
});

const TitleBottom = glamorous.view({
  alignItems: 'center',
  height: '35%',
  flexDirection: 'row',
});

const ProfileImage = ({ source }) => (
  <ProfileImageShadow>
    <ProfileImageContainer>
      <StyledProgressiveImage
        resize="cover"
        source={source}
      />
    </ProfileImageContainer>
  </ProfileImageShadow>
);

ProfileImage.propTypes = {
  source: PropTypes.string,
};

ProfileImage.defaultProps = {
  source: '',
};

const MainButton = ({ title, onPress }) => (
  <View flex={3}>
    <Button onPress={onPress} block title={title} style={{ height: 35, marginLeft: 0 }} />
  </View>
);

MainButton.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
};

MainButton.defaultProps = {
  title: '',
  onPress: null,
};

const MoreButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ flex: 1, justifyContent: 'center' }}>
    <Icon name="md-more" style={{ color: grey, fontSize: 28 }} />
  </TouchableOpacity>
);

MoreButton.propTypes = {
  onPress: PropTypes.func,
};

MoreButton.defaultProps = {
  onPress: null,
};

const ProfileDescription = glamorous.view({
  paddingHorizontal: scenePadding,
  marginTop: scenePadding,
});

const ExpandButton = ({ onPress, text }) => (
  <TouchableOpacity onPress={onPress}>
    <StyledText size="small" color="grey">{text}</StyledText>
  </TouchableOpacity>
);

ExpandButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
};

ExpandButton.defaultProps = {
  text: '',
  onPress: null,
};

const ProfileStatus = glamorous.view({
  flexDirection: 'row',
  paddingHorizontal: scenePadding,
  marginTop: scenePadding,
});

const Status = ({ statusType, ranking }) => (
  <View flexDirection="row" alignItems="center" style={{ marginLeft: statusType === 'rating' ? 10 : 0 }}>
    <Icon
      name={statusType === 'popularity' ? 'md-heart' : 'ios-star'}
      style={{ fontSize: 17, color: statusType === 'popularity' ? red : yellow, marginRight: 5 }}
    />
    <StyledText
      size="xsmall"
      style={{ marginLeft: 0 }}
    >
      Rank #{ranking}
      <StyledText
        size="xsmall"
        color="grey"
      >
        &nbsp;({statusType})
      </StyledText>
    </StyledText>
  </View>
);

Status.propTypes = {
  statusType: PropTypes.oneOf(['popularity', 'rating']),
  ranking: PropTypes.string,
};

Status.defaultProps = {
  statusType: 'popularity',
  ranking: '',
};

class SceneHeader extends Component {
  state = {
    expanded: false,
  }

  toggleExpanded = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const {
      type,
      title,
      description,
      coverImage,
      posterImage,
      popularityRank,
      ratingRank,
      categories,
    } = this.props;

    const expandedText = this.state.expanded ? 'less' : 'more';

    return (
      <HeaderContainer>
        <CoverImage>
          <MaskedImage
            maskedBottom
            source={{ uri: coverImage || defaultCover }}
          />
        </CoverImage>

        <ProfileHeader>
          <ProfileImage source={{ uri: posterImage || defaultAvatar }} />

          <TitleView>
            <TitleTop>
              <StyledText size="xsmall" color="light">{type}</StyledText>
              <StyledText size="large" color="light" bold>{title}</StyledText>
            </TitleTop>

            <TitleBottom>
              <MainButton title="Add to Library" />
              <MoreButton />
            </TitleBottom>
          </TitleView>
        </ProfileHeader>

        <ProfileDescription>
          <StyledText size="small" ellipsizeMode="tail" numberOfLines={!this.state.expanded && 4}>{description}</StyledText>
          <ExpandButton onPress={this.toggleExpanded} text={expandedText} />
        </ProfileDescription>

        <ProfileStatus>
          <Status statusType="popularity" ranking={popularityRank} />
          <Status statusType="rating" ranking={ratingRank} />
        </ProfileStatus>

        <ScrollableCategories categories={categories} />
      </HeaderContainer>
    );
  }
}

SceneHeader.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  coverImage: PropTypes.string,
  posterImage: PropTypes.string,
  popularityRank: PropTypes.string,
  ratingRank: PropTypes.string,
  categories: PropTypes.array,
};

SceneHeader.defaultProps = {
  type: '',
  title: '',
  description: '',
  coverImage: '',
  posterImage: '',
  popularityRank: '',
  ratingRank: '',
  categories: [],
};

export default SceneHeader;
