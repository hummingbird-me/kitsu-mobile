import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { IntroHeader } from './common/';
import styles from './styles';

export default class OnboardingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    step: 0,
  };

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
          <View style={styles.buttonsWrapper}>
            <View style={styles.dotContainer}>{this.renderDots()}</View>
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
