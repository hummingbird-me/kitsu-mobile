import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { defaultAvatar, defaultCover } from 'kitsu/constants/app';
import { Button } from 'kitsu/components/Button';
import { StyledText, ViewMoreStyledText } from 'kitsu/components/StyledText';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import Icon from 'react-native-vector-icons/Ionicons';
import { Pill } from 'kitsu/screens/Profiles/components/Pill';
import { StyledProgressiveImage } from 'kitsu/screens/Profiles/components/StyledProgressiveImage';
import { MaskedImage } from 'kitsu/screens/Profiles/components/MaskedImage';
import { cardSize } from 'kitsu/screens/Profiles/constants';
import { isEmpty, capitalize, isNull, isArray } from 'lodash';
import { styles } from './styles';

const PILL_COLORS = ['#CC6549', '#E79C47', '#6FB98E', '#629DC8', '#A180BE'];

export class SceneHeader extends PureComponent {
  renderDescription = () => {
    const {
      variant,
      popularityRank,
      ratingRank,
      categories,
      description,
      followersCount,
      followingCount,
      averageRating,
    } = this.props;

    // Truncate the rating
    const rating = averageRating && Math.trunc(averageRating);

    if (variant === 'media') {
      return (
        <View>
          {/* Rankings */}
          <View style={styles.descriptionView}>
            <ViewMoreStyledText size="small" color="dark" ellipsizeMode="tail" numberOfLines={4}>{description}</ViewMoreStyledText>
          </View>
          <View style={styles.statusView}>
            <View style={styles.kitsuScore}>
              <StyledText size="xxsmall" color="grey" bold>
                Kitsu Score
              </StyledText>
              <StyledText size="large" color="dark" bold textStyle={styles.kitsuScoreText}>
                {(rating && `${rating}%`) || '-'}
              </StyledText>
            </View>
            <View style={styles.subStatusView}>
              <Status statusType="rating" ranking={isNull(ratingRank) ? ' -' : ratingRank} />
              <Status statusType="popularity" ranking={isNull(popularityRank) ? ' -' : popularityRank} />
            </View>
          </View>

          {/* Categories pills */}
          <FlatList
            horizontal
            style={styles.categories}
            contentContainerStyle={styles.categoriesInner}
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({ index, item }) => {
              const colorIndex = index % PILL_COLORS.length;
              const color = PILL_COLORS[colorIndex];
              return (
                <View style={{ marginLeft: 5 }}>
                  <Pill color={color} label={item.title} />
                </View>
              );
            }}
          />
        </View>
      );
    }

    return (
      <View>
        <View style={styles.descriptionView}>
          <StyledText size="small" color="dark">{description}</StyledText>
        </View>
        <View style={styles.statusView}>
          <FollowStatus followStatusType="following" count={followingCount} />
          <FollowStatus followStatusType="followers" count={followersCount} />
        </View>
      </View>
    );
  }

  renderMainButton = () => {
    if (this.props.variant === 'media') {
      return (
        <SelectMenu
          options={this.props.mainButtonOptions}
          onOptionSelected={this.props.onMainButtonOptionsSelected}
          activeOpacity={0.8}
          disabled={this.props.mainButtonLoading}
          style={styles.mainButtonView}
        >
          <Button
            block
            title={this.props.mainButtonTitle}
            loading={this.props.mainButtonLoading}
            style={styles.mainButton}
          />
        </SelectMenu>
      );
    }

    return (
      <View style={styles.mainButtonView}>
        <Button
          block
          title={this.props.mainButtonTitle}
          loading={this.props.mainButtonLoading}
          style={styles.mainButton}
          onPress={this.props.onFollowButtonPress}
        />
      </View>
    );
  }

  render() {
    const {
      variant,
      title,
      posterImage,
      moreButtonOptions,
      onMoreButtonOptionsSelected,
      showMoreButton,
      subtitle,
    } = this.props;

    // Setup the media subtitles
    let mediaSubTitle = isEmpty(subtitle) ? '' : subtitle;
    if (isArray(mediaSubTitle)) {
      // Join the subtitles
      mediaSubTitle = mediaSubTitle.filter(t => !isEmpty(t)).join(' · ');
    }

    return (
      <View style={[styles.container, styles[`container__${variant}`]]}>
        <View style={[styles.backgroundView, styles[`backgroundView__${variant}`]]} />
        <View style={[styles.profileHeaderView, styles[`profileHeaderView__${variant}`]]}>
          {/* Profile Poster Image */}
          <View style={[styles.profileImageViewShadow, styles[`profileImageViewShadow__${variant}`]]}>
            <View style={[styles.profileImageView, styles[`profileImageView__${variant}`]]}>
              <StyledProgressiveImage
                variant={variant}
                resize="cover"
                source={{ uri: posterImage || defaultAvatar }}
                borderRadius={variant === 'profile' ? cardSize.square.width : 6}
              />
            </View>
          </View>

          <View style={[styles.titleView, styles[`titleView__${variant}`]]}>
            {/* Title */}
            <View style={[styles.titleTop, styles[`titleTop__${variant}`]]}>
              {!isEmpty(mediaSubTitle) &&
                <StyledText size="xsmall" color="light">
                  {mediaSubTitle}
                </StyledText>
              }
              <StyledText size="large" color="light" bold numberOfLines={4}>{title}</StyledText>
            </View>

            {/* Add to library button & more button */}
            <View style={[styles.titleBottom, styles[`titleBottom__${variant}`]]}>
              {this.renderMainButton()}
              {showMoreButton &&
                <SelectMenu
                  options={moreButtonOptions}
                  onOptionSelected={onMoreButtonOptionsSelected}
                  style={styles.moreButton}
                >
                  <Icon name="md-more" style={styles.moreIcon} />
                </SelectMenu>
              }
            </View>
          </View>
        </View>

        {this.renderDescription()}
      </View>
    );
  }
}

const Status = ({ statusType, ranking }) => (
  <View style={[styles.statusItemView, styles[`statusItem__${statusType}`]]}>
    <Icon
      name={statusType === 'popularity' ? 'md-heart' : 'ios-star'}
      style={[styles.statusIcon, styles[`statusIcon__${statusType}`]]}
    />
    <StyledText size="xsmall" color="dark">
      Rank #{ranking}
      <StyledText size="xsmall" color="grey">&nbsp;({capitalize(statusType)})</StyledText>
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
  <View style={[styles.followStatus, styles[`followStatus__${followStatusType}`]]}>
    <StyledText size="xsmall" color="dark">
      {count}
      <StyledText size="xsmall" color="grey">&nbsp;{followStatusType === 'following' ? 'Following' : 'Followers'}</StyledText>
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

SceneHeader.propTypes = {
  categories: PropTypes.array,
  description: PropTypes.string,
  followersCount: PropTypes.number,
  followingCount: PropTypes.number,
  mainButtonOptions: PropTypes.array,
  mainButtonTitle: PropTypes.string,
  moreButtonOptions: PropTypes.array,
  showMoreButton: PropTypes.bool,
  onFollowButtonPress: PropTypes.func,
  onMainButtonOptionsSelected: PropTypes.func,
  onMoreButtonOptionsSelected: PropTypes.func,
  posterImage: PropTypes.string,
  ratingRank: PropTypes.number,
  popularityRank: PropTypes.number,
  averageRating: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  variant: PropTypes.oneOf(['profile', 'media', 'group']),
};

SceneHeader.defaultProps = {
  categories: [],
  description: '',
  followersCount: 0,
  followingCount: 0,
  headerLeftButtonTitle: '',
  mainButtonOptions: [],
  mainButtonTitle: 'Follow',
  moreButtonOptions: [],
  showMoreButton: true,
  onFollowButtonPress: null,
  onHeaderLeftButtonPress: null,
  onMainButtonOptionsSelected: null,
  onMoreButtonOptionsSelected: null,
  posterImage: '',
  popularityRank: null,
  ratingRank: null,
  averageRating: null,
  title: '',
  subtitle: null,
  variant: 'profile',
};
