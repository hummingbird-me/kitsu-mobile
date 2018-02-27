import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { slide1, slide2, slide3, slide4 } from 'kitsu/assets/img/intro/';
import { Button } from 'kitsu/components/Button';
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
    desc: 'Log and rate what you’ve seen and read to build a library of your history.',
    image: slide2,
  },
  {
    title: 'Join the Community',
    desc: 'Kitsu makes finding new like-minded friends easy with the global activity feed.',
    image: slide3,
  },
  {
    title: 'Share your Reactions',
    desc: 'Check the media ratings and reviews from other users and leave your own!',
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
  static navigationOptions = {
    header: null,
  };

  state = {
    step: 0,
  };
  navigating = false;

  handleScroll = ({ nativeEvent: { contentOffset: { x } } }) => {
    const SCREEN_WIDTH = Dimensions.get('window').width;
    const position = x / SCREEN_WIDTH;
    if (!this.navigating && position > INTROS.length - 2 + 0.05) {
      this.props.navigation.navigate('Registration');
      this.navigating = true; // prevent triggering navigate twice.
    } else {
      // abs for -x direction values: prevent -1 value for step
      this.setState({ step: Math.floor(Math.abs(x) / SCREEN_WIDTH) });
    }
  };

  renderStep = () => INTROS.map((item, index) => <Step key={`step-${index}`} {...item} />);

  renderDots = () =>
    INTROS.map((_, index) => <Dot key={`dot-${index}`} active={index === this.state.step} />);

  render() {
    const { navigate } = this.props.navigation;

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
              onPress={() => navigate('Registration')}
            />
          </View>
        </View>
      </View>
    );
  }
}
