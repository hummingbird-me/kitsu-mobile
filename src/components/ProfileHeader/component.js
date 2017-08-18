import { Image, StatusBar, StyleSheet, View } from 'react-native';
import { Body, Button, Icon, Left, Right, Text } from 'native-base';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { styles } from './styles';
import { defaultAvatar, defaultCover } from '../../constants/app';
import * as colors from '../../constants/colors';

const CustomStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
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
      <View style={StyleSheet.flatten(styles.header)}>
        <Image style={styles.headerImage} source={{ uri: coverImageUri }} />

        <Left>
          <Button transparent onPress={goBack}>
            <Icon name="arrow-back" style={StyleSheet.flatten(styles.backButton)} />
            <Image style={styles.profileImage} source={{ uri: profileImageUri }} />
            {followButton && <Text style={StyleSheet.flatten(styles.titleText)}>{title}</Text>}
          </Button>
        </Left>

        {!followButton && (
        <Body>
          <View style={{ backgroundColor: 'transparent' }}>
            <Text style={StyleSheet.flatten(styles.titleText)}>{title}</Text>
          </View>
        </Body>
        )}

        <Right>
          {followButton && (
          <Button transparent style={StyleSheet.flatten(styles.followButton)} onPress={goBack}>
            <Text style={StyleSheet.flatten(styles.followText)}>Follow</Text>
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
