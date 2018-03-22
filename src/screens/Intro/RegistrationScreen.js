import React from 'react';
import { View, FlatList, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { LoginManager } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import { Button } from 'kitsu/components/Button';
import { loginUser } from 'kitsu/store/auth/actions';
import * as colors from 'kitsu/constants/colors';
import { placeholderImage } from 'kitsu/assets/img/intro';
import { kitsuConfig } from 'kitsu/config/env';
import { Sentry } from 'react-native-sentry';
import { IntroHeader } from './common/';
import styles from './styles';

class RegistrationScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    loggingUser: false,
    topAnime: Array(10).fill({}),
    topManga: Array(10).fill({}),
  };

  componentDidMount() {
    this.fetchTopMedia();
  }

  componentWillUnmount() {
    clearInterval(this.animation);
  }

  animation = 0;

  fetchTopMedia = async () => {
    // TODO: handle network error.
    try {
      const topAnime = await fetch(
        `${kitsuConfig.baseUrl}/edge/trending/anime?limit=10`,
      ).then(res => res.json());
      const topManga = await fetch(
        `${kitsuConfig.baseUrl}/edge/trending/manga?limit=10`,
      ).then(res => res.json());
      this.setState(
        {
          topAnime: topAnime.data,
          topManga: topManga.data,
        },
        this.animateLists,
      );
    } catch (e) {
      console.log(e);
    }
  };

  animateLists = () => {
    const time = Platform.select({ ios: 120, android: 40 });
    const offsetBy = Platform.select({ ios: 4, android: 1 });
    let offset = 4;
    this.animation = setInterval(() => {
      this.animeList.scrollToOffset({ offset, animated: true });
      this.mangaList.scrollToOffset({ offset, animated: true });
      offset += offsetBy;
    }, time);
  };

  loginFacebook = () => {
    const { navigation } = this.props;
    this.setState({ loggingUser: true });
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      (result) => {
        if (!result.isCancelled) {
          this.props.loginUser(null, navigation, 'registration');
        } else {
          this.setState({ loggingUser: false });
        }
      },
      (error) => {
        this.setState({ loggingUser: false });
        Sentry.captureMessage('FBSDK - Facebook Login Failed', {
          extra: {
            error,
          },
        });
        console.log(`Login fail with error: ${error}`);
      },
    );
  };

  populateList = (topList) => {
    const list = this.state[topList];
    this.setState({
      [topList]: list.concat(list),
    });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <FastImage
      source={(item.attributes && { uri: item.attributes.posterImage.large }) || placeholderImage}
      style={styles.squareImage}
    />
  );

  render() {
    const { navigate } = this.props.navigation;
    const { loggingUser, topAnime, topManga } = this.state;
    // TODO: make this screen responsive.
    // TODO: as of react native 0.47, flatlist has inverted prop
    return (
      <View style={styles.container}>
        <IntroHeader style={styles.header} />
        <View style={styles.bodyWrapper}>
          <View>
            <FlatList
              ref={(ref) => {
                this.animeList = ref;
              }}
              style={[styles.animatedList, { transform: [{ scaleX: -1 }] }]}
              horizontal
              scrollEnabled={false}
              data={topAnime}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              onEndReached={() => this.populateList('topAnime')}
              onEndReachedThreshold={0.5}
              showsHorizontalScrollIndicator={false}
            />
            <FlatList
              ref={(ref) => {
                this.mangaList = ref;
              }}
              horizontal
              scrollEnabled={false}
              style={styles.animatedList}
              data={topManga}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              onEndReached={() => this.populateList('topManga')}
              onEndReachedThreshold={0.5}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={styles.buttonsWrapper}>
            <Button
              style={styles.buttonFacebook}
              title={'Sign up with Facebook'}
              icon={'facebook-official'}
              loading={loggingUser}
              onPress={this.loginFacebook}
            />
            <Button
              style={styles.buttonCreateAccount}
              title={'Create an Account'}
              onPress={() => navigate('AuthScreen', { authType: 'signup' })}
            />
            <Button
              style={styles.buttonAlreadyAccount}
              title={'Already have an account?'}
              titleStyle={{ fontSize: 12, color: colors.lightGrey }}
              onPress={() => navigate('AuthScreen', { authType: 'login' })}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default connect(null, { loginUser })(RegistrationScreen);
