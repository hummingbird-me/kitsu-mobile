import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { defaultAvatar, defaultCover } from 'kitsu/constants/app';
import { commonStyles } from 'kitsu/common/styles';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { getImgixCoverImage } from 'kitsu/utils/coverImage';
import { styles } from './styles';

export const ProfileHeader = ({
  profile,
  showCoverImage,
  showFollowButton,
  showProfileImage,
  title,
  onClickBack,
  onClickFollow,
  hasOverlay,
}) => {
  const coverImageUri = getImgixCoverImage(profile.coverImage) || defaultCover;
  const profileImageUri = (profile.avatar && profile.avatar.tiny) || defaultAvatar;
  const goBack = () => onClickBack();

  return (
    <View style={styles.headerContainer}>
      {hasOverlay && <View style={styles.overlay} />}
      {showCoverImage &&
        <ProgressiveImage
          hasOverlay
          style={commonStyles.absoluteFill}
          source={{ uri: coverImageUri }}
        />
      }

      <View style={styles.headerWrapper}>
        <View style={[styles.header]}>
          {/* if there is no follow button, render the absolute-centered header first
          so that the back button still lays over top of it. */}
          {!showFollowButton && (
            <View style={styles.titleOnlyContainer}>
              <Text style={[
                commonStyles.text,
                commonStyles.colorWhite,
                styles.titleText]}
              >
                {title}
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.backButton} transparent onPress={goBack}>
            <Icon name="chevron-left" style={[commonStyles.colorWhite, commonStyles.transparent, styles.chevronStyle]} />
            {showProfileImage &&
              <FastImage style={styles.profileImage} source={{ uri: profileImageUri }} borderRadius={15} />
            }
            {showFollowButton &&
              <Text style={[
                commonStyles.text,
                commonStyles.colorWhite,
                styles.titleText]}
              >
                {title}
              </Text>
            }
          </TouchableOpacity>

          {showFollowButton && (
            <TouchableOpacity transparent style={styles.followButton} onPress={onFollow}>
              <Text style={[commonStyles.text, commonStyles.colorWhite]}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

ProfileHeader.propTypes = {
  onClickFollow: PropTypes.func,
  onClickBack: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  showCoverImage: PropTypes.bool,
  showFollowButton: PropTypes.bool,
  showProfileImage: PropTypes.bool,
  title: PropTypes.string,
  hasOverlay: PropTypes.bool,
};

ProfileHeader.defaultProps = {
  onClickFollow: () => {},
  onClickBack: () => {},
  showCoverImage: true,
  showFollowButton: false,
  showProfileImage: true,
  title: '',
  hasOverlay: false,
};
