import React from 'react';
import { View, Image, FlatList } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import { Button } from 'kitsu/components/Button';
import { loginUser } from 'kitsu/store/auth/actions';
import * as colors from 'kitsu/constants/colors';
import { OnboardingHeader } from './common/';
import styles from './styles';

const TEMP_IMG_URL = 'https://goo.gl/7XKV53';

const GalleryRow = () => (
  <View style={styles.galleryRow}>
    <Image source={{ uri: TEMP_IMG_URL }} style={styles.squareImage} />
    <Image source={{ uri: TEMP_IMG_URL }} style={styles.squareImage} />
    <Image source={{ uri: TEMP_IMG_URL }} style={styles.squareImage} />
    <Image source={{ uri: TEMP_IMG_URL }} style={styles.squareImage} />
  </View>
);

class RegistrationScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    loggingUser: false,
    topAnime: [],
    topManga: [],
  }
  animation = 0;

  componentDidMount() {
    this.fetchTopMedia();
  }

  componentWillUnMount() {
    clearInterval(this.animation);
  }

  fetchTopMedia = async () => {
    // TODO: use kitsu
    const topAnime = await fetch('https://kitsu.io/api/edge/trending/anime?limit=10').then(res => res.json());
    const topManga = await fetch('https://kitsu.io/api/edge/trending/manga?limit=10').then(res => res.json());
    this.setState({
      topAnime: topAnime.data,
      topManga: topManga.data,
    }, this.animateLists);
  }

  animateLists = () => {
    let offset = 4;
    this.animation = setInterval(() => {
      this.animeList.scrollToOffset({ offset, animated: true });
      this.mangaList.scrollToOffset({ offset, animated: true });
      offset += 4;
    }, 120);
  }

  loginFacebook = () => {
    this.setState({ loggingUser: true })
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      (result) => {
        if (!result.isCancelled) {
          this.props.loginUser(null, navigation, 'signup');
        }
      },
      (error) => {
        this.setState({ loggingUser: false })
        console.log(`Login fail with error: ${error}`);
      },
    );
  };

  renderItem = ({ item }) => (
    <Image source={{ uri: item.attributes.posterImage.large }} style={styles.squareImage} />
  )

  render() {
    const { navigate } = this.props.navigation;
    const { loggingUser, topAnime, topManga } = this.state;
    // TODO: make this screen responsive.
    return (
      <View style={styles.container}>
        <OnboardingHeader style={styles.header} />
        <View style={{ flex: 8 }}>
          <View>
            <FlatList
              ref={ref => this.animeList = ref}
              style={{ marginBottom: 8 }}
              horizontal
              scrollEnabled={false}
              data={topAnime}
              renderItem={this.renderItem}
              onEndReached={() => {
                this.setState({
                  topAnime: this.state.topAnime.concat(topAnime),
                });
              }}
              onEndReachedThreshold={0.5}
            />
            <FlatList
              ref={ref => this.mangaList = ref}
              inverted
              horizontal
              scrollEnabled={false}
              style={{ marginTop: 8 }}
              data={topManga}
              renderItem={this.renderItem}
              onEndReached={() => {
                this.setState({
                  topManga: this.state.topManga.concat(topManga),
                });
              }}
              onEndReachedThreshold={0.5}
            />
          </View>
          <View style={styles.buttonsWrapper}>
            <Button
              style={{ backgroundColor: colors.fbBlueDark }}
              title={'Sign up with Facebook'}
              icon={'facebook-official'}
              loading={loggingUser}
              onPress={this.loginFacebook}
            />
            <Button
              style={{
                backgroundColor: colors.transparent,
                borderWidth: 1.5,
                borderColor: colors.darkGrey,
              }}
              title={'Create an Account'}
              onPress={() => navigate('Signup')}
            />
            <Button
              style={{ backgroundColor: colors.transparent }}
              title={'Already have an account?'}
              titleStyle={{ fontSize: 12, color: colors.lightGrey }}
              onPress={() => navigate('Login')}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default connect(null, { loginUser })(RegistrationScreen);
