import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import logo from 'kitsu/assets/img/kitsu-logo.png';
import styles from './styles';
import Step from './Step';
import Dot from './Dot';

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
  // dummy view for smooth transition. Removing this and adding an additional dot instead looks bad when swipe bounces back.
  {
    title: '',
    desc: '',
    image: null,
  },
];

class OnboardingScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    step: 0,
  };
  navigating = false;

  handleScroll = ({ nativeEvent: { contentOffset: { x } } }) => {
    const SCREEN_WIDTH = Dimensions.get('window').width;
    const position = (x / SCREEN_WIDTH);
    if (!this.navigating && position > (INTROS.length - 2) + 0.05) {
      this.props.navigation.navigate('Signup');
      this.navigating = true;
    } else {
      // abs for -x direction values: prevent -1 value for step
      this.setState({ step: Math.floor(Math.abs(x) / SCREEN_WIDTH) });
    }
  }

  renderStep = () => INTROS.map((item, index) => <Step key={`step-${index}`} {...item} />);

  renderDots = () => INTROS.map((_, index) => <Dot key={`dot-${index}`} active={index === this.state.step} />);

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <View style={styles.logoWrapper}>
            <Image style={styles.logo} source={logo} />
            <Text style={styles.logoText}>KITSU</Text>
          </View>
          <View style={styles.pageWrapper}>
            <View style={styles.page}>
              <ScrollView
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                alwaysBounceHorizontal={false}
                onScroll={this.handleScroll}
                scrollEventThrottle={300} // decrease for precision, lower values trigger onScroll more.
              >
                {this.renderStep()}
              </ScrollView>
            </View>
            <View style={styles.dotContainer}>
              {this.renderDots()}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigate('Signup')} style={styles.getStartedButton}>
          <Text style={styles.getStartedText}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

OnboardingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

OnboardingScreen.defaultProps = {
  navigation: {},
};

export default OnboardingScreen;
