import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import glamorous, { View } from 'glamorous-native';
import { defaultAvatar, defaultCover } from 'kitsu/constants/app';
import { Button } from 'kitsu/components/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import { red, yellow, grey } from 'kitsu/constants/colors';
import ScrollableCategories from 'kitsu/screens/Profiles/components/ScrollableCategories';
import {
  scenePadding,
  cardSize,
  coverImageHeight,
  borderWidth,
  spacing,
} from 'kitsu/screens/Profiles/constants';
import { MaskedImage, StyledProgressiveImage, StyledText } from 'kitsu/screens/Profiles/parts';

const HeaderContainer = glamorous.view({
  marginTop: -20, // to cover the status bar in iOS
  backgroundColor: '#FFFFFF',
  paddingBottom: spacing.small,
});

const CoverImage = glamorous.view({
  width: '100%',
  height: coverImageHeight,
});

const ProfileHeader = glamorous.view(
  {
    flexDirection: 'row',
    paddingHorizontal: scenePadding,
  },
  ({ variant }) => ({ marginTop: cardSize[variant === 'media' ? 'portraitLarge' : 'square'].height * (variant === 'media' ? -0.65 : -0.5) }),
);

const ProfileImageShadow = glamorous.view(
  {
    borderRadius: 6,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
  },
  ({ variant }) => ({
    borderRadius: variant === 'media' ? 6 : cardSize.square.width,
  }),
);

const ProfileImageContainer = glamorous.view(
  {
    borderWidth: 4 * borderWidth.hairline,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  ({ variant }) => ({
    width: cardSize[variant === 'media' ? 'portraitLarge' : 'square'].width,
    height: cardSize[variant === 'media' ? 'portraitLarge' : 'square'].height,
    borderRadius: variant === 'media' ? 6 : cardSize.square.width,
  }),
);

const TitleView = glamorous.view(
  {
    flex: 1,
    marginLeft: scenePadding,
    position: 'relative',
  },
  ({ variant }) => ({
    height: cardSize[variant === 'media' ? 'portraitLarge' : 'square'].height,
  }),
);

const TitleTop = glamorous.view(
  {
    justifyContent: 'flex-end',
    height: '65%',
    paddingBottom: scenePadding,
  },
  ({ variant }) => ({
    height: variant === 'media' ? '65%' : '50%',
  }),
);

const TitleBottom = glamorous.view(
  {
    alignItems: 'center',
    flexDirection: 'row',
  },
  ({ variant }) => ({
    height: variant === 'media' ? '35%' : '50%',
  }),
);

const ProfileImage = ({ variant, source }) => (
  <ProfileImageShadow>
    <ProfileImageContainer variant={variant}>
      <StyledProgressiveImage
        variant={variant}
        resize="cover"
        source={source}
      />
    </ProfileImageContainer>
  </ProfileImageShadow>
);

ProfileImage.propTypes = {
  variant: PropTypes.oneOf(['profile', 'media', 'group']),
  source: PropTypes.string,
};

ProfileImage.defaultProps = {
  variant: 'profile',
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

const FollowStatus = ({ followStatusType, count }) => (
  <View flexDirection="row" alignItems="center" style={{ marginLeft: followStatusType === 'followers' ? 10 : 0 }}>
    <StyledText
      size="xsmall"
      style={{ marginLeft: 0 }}
    >
      {count}
      <StyledText
        size="xsmall"
        color="grey"
      >
        &nbsp;{followStatusType === 'following' ? 'Following' : 'Followers'}
      </StyledText>
    </StyledText>
  </View>
);

FollowStatus.propTypes = {
  followStatusType: PropTypes.oneOf(['following', 'followers']),
  count: PropTypes.number,
};

FollowStatus.defaultProps = {
  followStatusType: 'following',
  count: 0,
};

export class SceneHeader extends Component {
  state = {
    expanded: false,
  }

  toggleExpanded = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  renderDescription = () => {
    const {
      variant,
      popularityRank,
      ratingRank,
      categories,
      description,
      followersCount,
      followingCount,
    } = this.props;
    if (variant === 'media') {
      const expandedText = this.state.expanded ? 'less' : 'more';
      return (
        <View>
          <ProfileDescription>
            <StyledText size="small" ellipsizeMode="tail" numberOfLines={!this.state.expanded && 4}>{description}</StyledText>
            <ExpandButton onPress={this.toggleExpanded} text={expandedText} />
          </ProfileDescription>
          <ProfileStatus>
            <Status statusType="popularity" ranking={popularityRank} />
            <Status statusType="rating" ranking={ratingRank} />
          </ProfileStatus>

          <ScrollableCategories categories={categories} />
        </View>
      );
    }

    return (
      <View>
        <ProfileDescription>
          <StyledText size="small">{description}</StyledText>
        </ProfileDescription>
        <ProfileStatus>
          <FollowStatus followStatusType="following" count={followingCount} />
          <FollowStatus followStatusType="followers" count={followersCount} />
        </ProfileStatus>
      </View>
    );
  }

  render() {
    const {
      variant,
      type,
      title,
      coverImage,
      posterImage,
    } = this.props;

    return (
      <HeaderContainer>
        <CoverImage>
          <MaskedImage
            maskedBottom
            source={{ uri: coverImage || defaultCover }}
          />
        </CoverImage>

        <ProfileHeader variant={variant}>
          <ProfileImage variant={variant} source={{ uri: posterImage || defaultAvatar }} />

          <TitleView variant={variant}>
            <TitleTop variant={variant}>
              <StyledText size="xsmall" color="light">{type}</StyledText>
              <StyledText size="large" color="light" bold>{title}</StyledText>
            </TitleTop>

            <TitleBottom variant={variant}>
              <MainButton title="Add to Library" />
              <MoreButton />
            </TitleBottom>
          </TitleView>
        </ProfileHeader>
        {this.renderDescription()}
      </HeaderContainer>
    );
  }
}

SceneHeader.propTypes = {
  variant: PropTypes.oneOf(['profile', 'media', 'group']),
  type: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  coverImage: PropTypes.string,
  posterImage: PropTypes.string,
  popularityRank: PropTypes.string,
  followersCount: PropTypes.number,
  followingCount: PropTypes.number,
  ratingRank: PropTypes.string,
  categories: PropTypes.array,
};

SceneHeader.defaultProps = {
  variant: 'profile',
  type: '',
  title: '',
  description: '',
  coverImage: '',
  posterImage: '',
  popularityRank: '',
  ratingRank: '',
  followersCount: 0,
  followingCount: 0,
  categories: [],
};
