import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { slide1, slide2, slide3, slide4 } from 'app/assets/img/intro/';
import { Button } from 'app/components/Button';
import { PropTypes } from 'prop-types';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'app/navigation';
import { IntroHeader } from './common/';
import styles from './styles';
import Step from './Step';
import Dot from './Dot';

const INTROS = [
  {
    title: 'More of what you love',
    desc: 'Get recommendations to discover your next favorite anime or manga!',
    image: slide1,
  },
  {
    title: 'Track your progress',
    desc:
      'Log and rate what you’ve seen and read to build a library of your history.',
    image: slide2,
  },
  {
    title: 'Join the Community',
    desc:
      'Kitsu makes finding new like-minded friends easy with the global activity feed.',
    image: slide3,
  },
  {
    title: 'Share your Reactions',
    desc:
      'Check the media ratings and reviews from other users and leave your own!',
    image: slide4,
  },
  // dummy view for smooth transition. Removing this and adding an additional dot instead looks bad when swipe bounces back.
  {
    title: '',
    desc: '',
    image: null,
  },
];

export default class OnboardingScreen extends React.Component {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
  };

  state = {
    step: 0,
  };

  navigating = false;

  handleScroll = ({
    nativeEvent: {
      contentOffset: { x },
    },
  }) => {
    const SCREEN_WIDTH = Dimensions.get('window').width;
    const position = x / SCREEN_WIDTH;
    if (!this.navigating && position > INTROS.length - 2 + 0.05) {
      this.navigateToRegistration();
      this.navigating = true; // prevent triggering navigate twice.
    } else {
      // abs for -x direction values: prevent -1 value for step
      this.setState({ step: Math.floor(Math.abs(x) / SCREEN_WIDTH) });
    }
  };

  navigateToRegistration = () => {
    Navigation.setStackRoot(this.props.componentId, {
      component: { name: Screens.AUTH_REGISTRATION },
    });
  };

  renderStep = () =>
    INTROS.map((item, index) => <Step key={`step-${index}`} {...item} />);

  renderDots = () =>
    INTROS.map((_, index) => (
      <Dot key={`dot-${index}`} active={index === this.state.step} />
    ));

  render() {
    return (
      <View style={styles.container}>
        <IntroHeader style={styles.header} />
        <View style={styles.bodyWrapper}>
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
          <View style={styles.dotContainer}>{this.renderDots()}</View>
          <View style={styles.buttonsWrapper}>
            <Button
              style={styles.getStartedButton}
              title={'Get Started'}
              titleStyle={styles.getStartedText}
              onPress={this.navigateToRegistration}
            />
          </View>
        </View>
      </View>
    );
  }
}
