import React from 'react';
import PropTypes from 'prop-types';
import { Text, Image } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { Container, Content, Footer, FooterTab, Button } from 'native-base';

import * as colors from '../../constants/colors';
import CustomIcon from '../../components/Icon';
import AnimatedWrapper from '../../components/AnimatedWrapper';

const AuthWrapper = ({ onSuccess, children, loading }) => {
  const loginFacebook = () => {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      (result) => {
        if (!result.isCancelled) {
          onSuccess(true);
        }
      },
      (error) => {
        console.log(`Login fail with error: ${error}`);
      },
    );
  };

  return (
    <Container style={styles.container}>
      <Content scrollEnabled={false}>
        <AnimatedWrapper />
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
        {children}
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
            disabled={loading}
            onPress={loginFacebook}
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
};

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

AuthWrapper.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  children: PropTypes.array,
};

AuthWrapper.defaultProps = {
  children: [],
};

const kitsuLogo = require('../../assets/img/kitsu-logo.png');

export default AuthWrapper;
