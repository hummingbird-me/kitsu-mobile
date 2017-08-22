import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Icon, Left, Right } from 'native-base';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { defaultAvatar, defaultCover } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { commonStyles } from 'kitsu/common/styles';
import { styles } from './styles';

const CustomStatusBar = ({ backgroundColor, ...props }) => (
  <View style={{ backgroundColor }}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

CustomStatusBar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
};

export const ProfileHeader = ({ profile, followButton, title, onClickBack }) => {
  const coverImageUri = (profile.coverImage && profile.coverImage.original) || defaultCover;
  const profileImageUri = (profile.avatar && profile.avatar.tiny) || defaultAvatar;
  const goBack = () => onClickBack();

  return (
    <View style={styles.headerContainer}>
      <CustomStatusBar backgroundColor={colors.darkPurple} barStyle="light-content" />
      <View style={styles.header}>
        <Image style={commonStyles.absoluteFill} source={{ uri: coverImageUri }} />

        <Left>
          <Button transparent onPress={goBack}>
            <Icon name="arrow-back" style={StyleSheet.flatten(commonStyles.colorWhite)} />
            <Image style={styles.profileImage} source={{ uri: profileImageUri }} />
            {followButton && <Text style={[commonStyles.text, commonStyles.colorWhite, styles.titleText]}>{title}</Text>}
          </Button>
        </Left>

        {!followButton && (
        <Body>
          <View style={{ backgroundColor: 'transparent' }}>
            <Text style={[commonStyles.text, commonStyles.colorWhite, styles.titleText]}>{title}</Text>
          </View>
        </Body>
        )}

        <Right>
          {followButton && (
          <Button transparent style={StyleSheet.flatten(styles.followButton)} onPress={goBack}>
            <Text style={[commonStyles.text, commonStyles.colorWhite]}>Follow</Text>
          </Button>
          )}
        </Right>
      </View>
    </View>
  );
};

ProfileHeader.propTypes = {
  profile: PropTypes.object.isRequired,
  followButton: PropTypes.bool,
  onClickBack: PropTypes.func,
  title: PropTypes.string,
};

ProfileHeader.defaultProps = {
  followButton: true,
  onClickBack: () => {},
  title: '',
};
