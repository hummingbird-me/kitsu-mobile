import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { defaultAvatar, defaultCover } from 'kitsu/constants/app';
import { Button } from 'kitsu/components/Button';
import { StyledText } from 'kitsu/components/StyledText';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import Icon from 'react-native-vector-icons/Ionicons';
import { Pill } from 'kitsu/screens/Profiles/components/Pill';
import { StyledProgressiveImage } from 'kitsu/screens/Profiles/components/StyledProgressiveImage';
import { MaskedImage } from 'kitsu/screens/Profiles/components/MaskedImage';
import { cardSize } from 'kitsu/screens/Profiles/constants';
import { styles } from './styles';

export class SceneHeader extends PureComponent {
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
          {/* Rankings */}
          <View style={styles.descriptionView}>
            <StyledText size="small" color="dark" ellipsizeMode="tail" numberOfLines={!this.state.expanded && 4}>{description}</StyledText>
            <TouchableOpacity onPress={this.toggleExpanded}>
              <StyledText size="small" color="grey">{expandedText}</StyledText>
            </TouchableOpacity>
          </View>
          <View style={styles.statusView}>
            <Status statusType="popularity" ranking={popularityRank} />
            <Status statusType="rating" ranking={ratingRank} />
          </View>

          {/* Categories pills */}
          <FlatList
            horizontal
            style={styles.categories}
            contentContainerStyle={styles.categoriesInner}
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({ item }) => (
              <View style={{ marginLeft: 5 }}><Pill label={item.title} /></View>
            )}
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
          style={styles.mainButtonView}
        >
          <Button
            block
            title={this.props.mainButtonTitle}
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
          style={styles.mainButton}
          onPress={this.props.onFollowButtonPress}
        />
      </View>
    );
  }

  render() {
    const {
      variant,
      type,
      title,
      posterImage,
      moreButtonOptions,
      onMoreButtonOptionsSelected,
    } = this.props;

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
              <StyledText size="xsmall" color="light">{type}</StyledText>
              <StyledText size="large" color="light" bold>{title}</StyledText>
            </View>

            {/* Add to library button & more button */}
            <View style={[styles.titleBottom, styles[`titleBottom__${variant}`]]}>
              {this.renderMainButton()}
              <SelectMenu
                options={moreButtonOptions}
                onOptionSelected={onMoreButtonOptionsSelected}
                style={styles.moreButton}
              >
                <Icon name="md-more" style={styles.moreIcon} />
              </SelectMenu>
            </View>
          </View>
        </View>

        {this.renderDescription()}
      </View>
    );
  }
}

const Status = ({ statusType, ranking }) => (
  <View style={[styles.statusItemView, styles[`statusItemView__${statusType}`]]}>
    <Icon
      name={statusType === 'popularity' ? 'md-heart' : 'ios-star'}
      style={[styles.statusIcon, styles[`statusIcon__${statusType}`]]}
    />
    <StyledText size="xsmall" color="dark">
      Rank #{ranking}
      <StyledText size="xsmall" color="grey">&nbsp;({statusType})</StyledText>
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
  onFollowButtonPress: PropTypes.func,
  onMainButtonOptionsSelected: PropTypes.func,
  onMoreButtonOptionsSelected: PropTypes.func,
  popularityRank: PropTypes.string,
  posterImage: PropTypes.string,
  ratingRank: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['profile', 'media', 'group']),
};

SceneHeader.defaultProps = {
  categories: [],
  coverImage: '',
  description: '',
  followersCount: 0,
  followingCount: 0,
  headerLeftButtonTitle: '',
  mainButtonOptions: [],
  mainButtonTitle: 'Follow',
  moreButtonOptions: [],
  onFollowButtonPress: null,
  onHeaderLeftButtonPress: null,
  onMainButtonOptionsSelected: null,
  onMoreButtonOptionsSelected: null,
  popularityRank: '',
  posterImage: '',
  ratingRank: '',
  title: '',
  type: '',
  variant: 'profile',
};
