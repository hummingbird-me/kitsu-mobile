import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import anilist from 'kitsu/assets/img/anilist.png';
import myanimelist from 'kitsu/assets/img/myanimelist.png';
import { Screens } from 'kitsu/navigation';
import { OnboardingHeader } from 'kitsu/screens/Onboarding/common';

import { styles as commonStyles } from '../common/styles';
import { styles } from './styles';

const MediaItem = ({ style, onPress, image }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={1}
    style={[styles.buttonMedia, style]}
  >
    <FastImage source={image} style={styles.buttonLogo} cache="web" />
  </TouchableOpacity>
);

class ImportLibrary extends React.Component {
  state = {};

  onMediaItemPressed = (title, image) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.ONBOARDING_IMPORT_DETAIL,
        passProps: {
          item: {
            image,
            title,
          },
        },
      },
    });
  };

  render() {
    // TODO: tidy up this mess. onmediaitempressed etc.
    return (
      <View style={commonStyles.container}>
        <OnboardingHeader componentId={this.props.componentId} backEnabled />
        <View style={{ flex: 1 }}>
          <Text style={[commonStyles.tutorialText, { marginHorizontal: 16 }]}>
            Select a source below to import your previous anime and manga
            tracking data.
          </Text>
          <MediaItem
            style={{ marginTop: 24 }}
            onPress={() => this.onMediaItemPressed('MyAnimeList', myanimelist)}
            image={myanimelist}
            title={'MyAnimeList'}
          />
          <MediaItem
            onPress={() => this.onMediaItemPressed('Anilist', anilist)}
            image={anilist}
            title={'Anilist'}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { loading, error } = user;
  return { loading, error };
};
export default connect(mapStateToProps, null)(ImportLibrary);
