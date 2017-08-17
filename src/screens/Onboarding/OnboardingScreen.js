import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions } from 'react-native';
import { Container, Content, Footer, FooterTab, Button } from 'native-base';
import Carousel from 'react-native-snap-carousel';
import styles from './styles';
import Step from './Step';
import Dot from './Dot';
import * as colors from '../../constants/colors';

const styleObj = {
  container: {
    backgroundColor: colors.darkPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: colors.darkPurple,
    borderTopColor: 'rgba(98,79,94,1)',
    height: 60,
  },
  button: {
    width: 265,
    height: 50,
    alignSelf: 'center',
  },
  buttonLast: {
    backgroundColor: colors.lightGreen,
    borderWidth: 0,
  },
};

const INTROS = [
  {
    title: 'More of what you love',
    desc: 'Get recommendations to discover your next favorite anime or manga!',
    image: require('../../assets/img/intro1.png'),
  },
  {
    title: 'Track your progress',
    desc: 'Log and rate what you’ve seen and read to build a library of your history.',
    image: require('../../assets/img/intro2.png'),
  },
  {
    title: 'Join the Community',
    desc: 'Kitsu makes finding new like-minded friends easy with the global activity feed.',
    image: require('../../assets/img/intro3.png'),
  },
  {
    title: 'Share your Reactions',
    desc: 'Check the media ratings and reviews from other users and leave your own!',
    image: require('../../assets/img/intro4.png'),
  },
];

class OnboardingScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    step: 0,
  };

  renderStep = () => INTROS.map((item, index) => <Step key={`step-${index}`} {...item} />);

  renderDots = () =>
    INTROS.map((_, index) => <Dot key={`dot-${index}`} active={index === this.state.step} />);

  render() {
    const { navigate } = this.props.navigation;
    let btnStyle = styleObj.button;
    const last = this.state.step === INTROS.length - 1;
    if (last) {
      btnStyle = { ...styleObj.button, ...styleObj.buttonLast };
    }

    return (
      <Container style={styleObj.container}>
        <Content scrollEnabled={false}>
          <View style={{ flex: 1, alignItems: 'center', paddingTop: 76 }}>
            <Carousel
              inactiveSlideScale={0.90}
              inactiveSlideOpacity={0.5}
              enableMomentum={false}
              onSnapToItem={step => this.setState({ step })}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={265}
            >
              {this.renderStep()}
            </Carousel>
          </View>

          <View style={styles.dotContainer}>
            {this.renderDots()}
          </View>

          <Button
            rounded
            bordered={!last}
            light
            block
            style={btnStyle}
            onPress={() => navigate('Signup')}
          >
            <Text style={styles.getStartedBtn}>
              Get Started
            </Text>
          </Button>
        </Content>

        <Footer style={styleObj.footer}>
          <FooterTab>
            <Button full onPress={() => navigate('Login')}>
              <Text style={styles.footerButtonText}>
                Have an account? Sign in
              </Text>
            </Button>
          </FooterTab>
        </Footer>

      </Container>
    );
  }
}

OnboardingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default OnboardingScreen;
