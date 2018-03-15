import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import myanimelist from 'kitsu/assets/img/myanimelist.png';
import anilist from 'kitsu/assets/img/anilist.png';
import { styles } from './styles';
import { styles as commonStyles } from '../common/styles';

const MediaItem = ({ style, onPress, image }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={1} style={[styles.buttonMedia, style]}>
    <FastImage source={image} style={styles.buttonLogo} />
  </TouchableOpacity>
);

class ImportLibrary extends React.Component {
  static navigationOptions = {
    backEnabled: true,
  };

  state = {};

  onMediaItemPressed = (title, image) => {
    this.props.navigation.navigate('ImportDetail', {
      item: {
        image,
        title,
      },
    });
  };

  render() {
    // TODO: tidy up this mess. onmediaitempressed etc.
    return (
      <View style={commonStyles.container}>
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
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { loading, error } = user;
  return { loading, error };
};
export default connect(mapStateToProps, null)(ImportLibrary);
