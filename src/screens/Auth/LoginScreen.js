import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, Dimensions } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { Container, Content, Footer, FooterTab, Button } from 'native-base';
import { connect } from 'react-redux';

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
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.loginFacebook = this.loginFacebook.bind(this);
  }

  onSubmit() {
    const { username, password } = this.state;
    if (username.length > 0 && password.length > 0) {
      this.props.loginUser({ username, password });
    }
  }

  handleChange(text, name) {
    this.setState({ [name]: text });
  }
  loginFacebook() {
    this.setState({loading: true})
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      (result) => {
        if (result.isCancelled) {
          console.log('login canceled');
        } else {
          this.props.loginUser();
        }
        this.setState({loading: false})        
      },
      (error) => {
        alert(`Login fail with error: ${error}`);
      },
    );
  }
  render() {
    const ind = Math.floor(Math.random() * 4);
    return (
      <Container style={styles.container}>
        <Content scrollEnabled={false}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              style={{
                opacity: 0.2,
                width: Dimensions.get('window').width,
                height: 174,
              }}
              resizeMode="cover"
              source={images[ind]}
            />
            <Image
              style={{
                marginTop: -35,
                width: 71,
                height: 79,
              }}
              resizeMode="cover"
              source={kitsuLogo}
            />
          </View>
          <LoginForm
            data={this.state}
            handleChange={this.handleChange}
            onSubmit={this.onSubmit}
            loading={this.props.signingIn || this.state.loading}
          />
          <View style={{ padding: 20, paddingLeft: 25, paddingTop: 15 }}>
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
              style={{ flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: colors.fbBlue }}
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
const images = [
  require('../../assets/img/posters/fullmetal.jpg'),
  require('../../assets/img/posters/fullmetal2.png'),
  require('../../assets/img/posters/naruto.png'),
  require('../../assets/img/posters/naruto2.jpg'),
  require('../../assets/img/posters/deatnote.jpg'),
];
const kitsuLogo = require('../../assets/img/kitsu-logo.png');
/* eslint-enable global-require */

const mapStateToProps = ({auth}) => {
  const { signingIn } = auth;
  return {signingIn};
}

export default connect(mapStateToProps, { loginUser, loginUserFb })(LoginScreen);
