import { Image, StatusBar, StyleSheet, View } from 'react-native';
import { Container, Header, Left, Button, Icon, Text } from 'native-base';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { styles } from './styles';
import { defaultCover } from '../../../constants/app';
import * as colors from '../../../constants/colors';

const CustomStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

CustomStatusBar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
};

export const NavigationHeader = (navigationProps) => {
  const { profile } = navigationProps.state.params;
  const coverImageUri = (profile.coverImage && profile.coverImage.original) || defaultCover;
  const goBack = () => navigationProps.goBack();

  return (
    <View style={styles.headerContainer}>
      <CustomStatusBar backgroundColor={colors.darkPurple} barStyle="light-content" />
      <View style={StyleSheet.flatten(styles.header)}>
        <Image style={styles.headerImage} source={{ uri: coverImageUri }} />

        <Button transparent onPress={goBack}>
          <Icon name="arrow-back" style={{ color: 'white' }} />
          <Image style={styles.profileImage} source={{ uri: 'https://placehold.it/100x100' }} />
          <Text style={styles.profileName}>{profile.name}</Text>
        </Button>

        <Button transparent onPress={goBack}>
          <Text>Follow</Text>
        </Button>
      </View>
    </View>
  );
};
