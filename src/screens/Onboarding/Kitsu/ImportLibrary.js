import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import myanimelist from 'app/assets/img/myanimelist.png';
import anilist from 'app/assets/img/anilist.png';
import { OnboardingHeader } from 'app/screens/Onboarding/common';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'app/navigation';
import { styles } from './styles';
import { styles as commonStyles } from '../common/styles';

const MediaItem = ({ style, onPress, image }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={1} style={[styles.buttonMedia, style]}>
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
        <OnboardingHeader
          componentId={this.props.componentId}
          backEnabled
        />
        <View style={{ flex: 1 }}>
          <Text style={[commonStyles.tutorialText, { marginHorizontal: 16 }]}>
            Select a source below to import your previous anime and manga tracking data.
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
