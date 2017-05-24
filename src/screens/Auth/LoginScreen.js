import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { Container, Content, Footer, FooterTab, Button } from 'native-base';
import { connect } from 'react-redux';
import { Image } from 'react-native-animatable';

import * as colors from '../../constants/colors';
import CustomIcon from '../../components/Icon';
import LoginForm from '../../components/Forms/LoginForm';
import { loginUser, loginUserFb } from '../../store/auth/actions';

class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loading: false,
      ind: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.loginFacebook = this.loginFacebook.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
  }

  componentDidMount() {
    const ind = Math.floor(Math.random() * 4);
    this.setState({ ind });
    this.startAnimation();
  }

  onSubmit() {
    const { username, password } = this.state;
    if (username.length > 0 && password.length > 0) {
      this.props.loginUser({ username, password }, this.props.navigation);
    }
  }

  handleChange(text, name) {
    this.setState({ [name]: text });
  }
  loginFacebook() {
    this.setState({ loading: true });
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      (result) => {
        if (result.isCancelled) {
          console.log('login canceled');
        } else {
          this.props.loginUser(null, this.props.navigation);
        }
        this.setState({ loading: false });
      },
      (error) => {
        alert(`Login fail with error: ${error}`);
      },
    );
  }

  startAnimation(e) {
    const s1 = this.state.scale || 1;
    const s2 = s1 === 1 ? 1.1 : 1;
    const tx2 = (Math.floor(Math.random() * 6) - 3) * 2;
    const ty2 = (Math.floor(Math.random() * 6) - 3) * 2;
    console.log(tx2, ty2);

    this.refs.image.transition(
      { opacity: 0, scale: s1, translateX: 0, translateY: 0 },
      { opacity: 0.6, scale: 1.05, translateX: tx2 / 2, translateY: ty2 / 2 },
      animDuration,
      'ease-in',
    );
    setTimeout(
      () =>
        this.refs.image.transition(
          { opacity: 0.6, scale: 1.05, translateX: tx2 / 2, translateY: ty2 / 2 },
          { opacity: 0, scale: s2, translateX: tx2, translateY: ty2 },
          animDuration,
          'ease-out',
        ),
      animDuration - 10,
    );
    setTimeout(this.startAnimation, 2 * animDuration-400);
    const ind = this.state.ind === images.length - 1 ? 0 : this.state.ind + 1;
    this.setState({ ind, scale: s2 });
  }
  render() {
    const { ind } = this.state;
    return (
      <Container style={styles.container}>
        <Content scrollEnabled={false}>
          <View style={{ flex: 1, alignItems: 'center', height: 174, overflow: 'hidden' }}>
            <Image
              ref="image"
              style={{
                opacity: 0.4,
                width: Dimensions.get('window').width,
                height: 174,
              }}
              resizeMode="cover"
              source={images[ind]}
            />
          </View>
            <Image
              style={{
                marginTop: -35,
                width: 71,
                height: 79,
                alignSelf: 'center',
              }}
              resizeMode="cover"
              source={kitsuLogo}
            />
          <LoginForm
            data={this.state}
            handleChange={this.handleChange}
            onSubmit={this.onSubmit}
            loading={this.props.signingIn || this.state.loading}
          />
          <View style={{ padding: 20, paddingLeft: 25, paddingTop: 15 }}>
            {this.props.loginError
              ? <Text style={{ color: 'red', paddingBottom: 10, textAlign: 'center' }}>
                {this.props.loginError}
              </Text>
              : null}
            <Text
              style={{
                color: colors.white,
                opacity: 0.6,
                lineHeight: 17,
                fontSize: 12,
                fontWeight: '400',
                fontFamily: 'OpenSans',
                textAlign: 'center',
              }}
            >
              Forgot your password?
            </Text>
          </View>
          <View style={{ padding: 20, paddingLeft: 25, paddingTop: 45 }}>
            <Button
              block
              bordered
              light
              style={{
                height: 34,
                borderWidth: 0.6,
                borderColor: 'rgba(255,255,255,0.3)',
                borderRadius: 3,
              }}
            >
              <Text
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'OpenSans',
                  fontWeight: '600',
                  lineHeight: 20,
                  fontSize: 12,
                }}
              >
                Need an account?
                <Text
                  style={{
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {' '}Create one
                </Text>
              </Text>
            </Button>
          </View>
        </Content>
        <Footer style={styles.footer}>
          <FooterTab>
            <Button
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                backgroundColor: colors.fbBlue,
              }}
              block
              disabled={this.props.signingIn}
              onPress={this.loginFacebook}
            >
              <CustomIcon
                size={25}
                name="fb-icon"
                styles={{
                  color: colors.white,
                  paddingRight: 20,
                  paddingLeft: 10,
                }}
              />
              <Text style={styles.footerButtonText}>
                Sign in with Facebook
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
const styles = {
  container: {
    backgroundColor: colors.darkPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: colors.fbBlue,
    borderTopColor: colors.fbBlue,
    height: 57,
  },
  footerButtonText: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    lineHeight: 25,
    color: colors.white,
    textAlign: 'left',
  },
};

LoginScreen.propTypes = {
  loginUser: PropTypes.func.isRequired,
};

/* eslint-disable global-require */
const animDuration = 3000;
const images = [
  require('../../assets/img/posters/fullmetal.jpg'),
  require('../../assets/img/posters/fullmetal2.png'),
  require('../../assets/img/posters/naruto2.jpg'),
  require('../../assets/img/posters/deatnote.jpg'),
];
const kitsuLogo = require('../../assets/img/kitsu-logo.png');
/* eslint-enable global-require */

const mapStateToProps = ({ auth }) => {
  const { signingIn, loginError } = auth;
  return { signingIn, loginError };
};

export default connect(mapStateToProps, { loginUser, loginUserFb })(LoginScreen);
