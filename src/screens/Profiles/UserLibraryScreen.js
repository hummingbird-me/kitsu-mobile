import * as React from 'react';
import { Button, Container, Icon } from 'native-base';
import { Dimensions, ScrollView, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as colors from '../../constants/colors';
import { fetchUserLibrary } from '../../store/profile/actions';
import ProgressiveImage from '../../components/ProgressiveImage';
import { defaultCover } from '../../constants/app';
import SegmentTabBar from '../../components/SegmentTabBar';
import CustomHeader from '../../components/CustomHeader';

class UserLibraryScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-body" android="md-body" style={{ fontSize: 24, color: tintColor }} />
    ),
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { profile } = this.props.navigation.state.params;
    this.props.fetchUserLibrary(profile.id);
  }

  render() {
    const { navigation } = this.props;
    const { coverImage, name } = navigation.state.params.profile;

    return (
      <Container style={styles.container}>
        <ParallaxScrollView
          backgroundColor="#fff0"
          contentBackgroundColor="#fff0"
          parallaxHeaderHeight={60}
          renderBackground={() => (
            <ProgressiveImage
              style={{
                width: Dimensions.get('window').width,
                height: 125,
                backgroundColor: '#fff0',
              }}
              resizeMode="cover"
              source={{ uri: (coverImage && coverImage.original) || defaultCover }}
            />
          )}
        >
          <ScrollableTabView renderTabBar={() => <SegmentTabBar />}>
            <ScrollView key="Anime" tabLabel="Anime" id="anime" style={styles.scrollView}>
              <Text>Anime</Text>
            </ScrollView>
            <ScrollView key="Manga" tabLabel="Manga" id="manga" style={styles.scrollView}>
              <Text>Manga</Text>
            </ScrollView>
          </ScrollableTabView>
        </ParallaxScrollView>
        <CustomHeader
          style={styles.customHeader}
          navigation={navigation}
          headerImage={{ uri: coverImage && coverImage.original }}
          leftText={name}
          height={85}
        />
      </Container>
    );
  }
}

UserLibraryScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  fetchUserLibrary: PropTypes.func.isRequired,
};

const styles = {
  container: {
    alignItems: 'center',
    backgroundColor: colors.listBackPurple,
    justifyContent: 'center',
  },
  customHeader: {
    alignSelf: 'stretch',
    flex: 1,
    height: 85,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
};

const mapStateToProps = ({ profile }) => {
  const { anime, manga } = profile.userLibrary;

  return {
    anime,
    manga,
  };
};

export default connect(mapStateToProps, {
  fetchUserLibrary,
})(UserLibraryScreen);
