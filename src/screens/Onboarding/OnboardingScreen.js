import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, Dimensions } from 'react-native';
import { Container, Content, Footer, FooterTab, Button } from 'native-base';
import Carousel from 'react-native-snap-carousel';
import * as colors from '../../constants/colors';

const intros = [
  {
    title: 'More of what you love',
    desc: 'Get recommendations to discover your next favorite anime or manga!',
    img: require('../../assets/img/intro1.png'),
  },
  {
    title: 'Track your progress',
    desc: 'Log and rate what you’ve seen and read to build a library of your history.',
    img: require('../../assets/img/intro2.png'),
  },
  {
    title: 'Join the Community',
    desc: 'Kitsu makes finding new like-minded friends easy with the global activity feed.',
    img: require('../../assets/img/intro3.png'),
  },
  {
    title: 'Share your Reactions',
    desc: 'Check the media ratings and reviews from other users and leave your own!',
    img: require('../../assets/img/intro4.png'),
  },
];

class OnboardingScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };

    this.renderStep = this.renderStep.bind(this);
    this.renderDots = this.renderDots.bind(this);
  }
  renderStep() {
    return intros.map((item, index) => (
      <View
        key={index}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <View style={styles.slide}>
          <Image
            style={{
              width: 210,
              height: 230,
              marginTop: 30,
              resizeMode: 'contain',
            }}
            source={item.img}
          />
          <Text style={styles.text}>{item.title.toUpperCase()}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
      </View>
    ));
  }
  renderDots() {
    return intros.map((item, index) => (
      <View
        key={index}
        style={{
          backgroundColor: index === this.state.step ? colors.white : colors.lightPink,
          width: 8,
          height: 8,
          borderRadius: 4,
          marginLeft: 3,
          marginRight: 3,
          marginTop: 3,
          marginBottom: 3,
        }}
      />
    ));
  }
  render() {
    let btnStyle = styles.button;
    const { navigate } = this.props.navigation;
    const last = this.state.step === intros.length - 1;
    if (last) {
      btnStyle = { ...styles.button, ...styles.buttonLast };
    }
    return (
      <Container style={styles.container}>
        <Content scrollEnabled={false}>
          <View style={{ flex: 1, alignItems: 'center', paddingTop: 76 }}>
            <Carousel
              ref={(carousel) => {
                this._carousel = carousel;
              }}
              inactiveSlideScale={0.90}
              inactiveSlideOpacity={0.5}
              enableMomentum={false}
              onSnapToItem={slideIndex => this.setState({ step: slideIndex })}
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
            <Text style={{ color: colors.white, textAlign: 'center', fontSize: 17 }}>
              Get Started
            </Text>
          </Button>
        </Content>
        <Footer style={styles.footer}>
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
  navigation: PropTypes.object,
};

OnboardingScreen.defaultProps = {
  navigation: {},
};
const styles = {
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
  footerButtonText: {
    opacity: 0.61,
    fontSize: 16,
    color: colors.white,
  },
  slide: {
    width: 265,
    height: 390,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  text: {
    marginTop: 5,
    color: '#333333',
    fontSize: 17,
    lineHeight: 21,
    fontWeight: 'bold',
  },
  desc: {
    padding: 15,
    paddingRight: 25,
    paddingLeft: 25,
    color: '#333333',
    fontSize: 17,
    lineHeight: 21,
    textAlign: 'center',
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
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
};

export default OnboardingScreen;
