import React from 'react';
import { Animated, Text, TextStyle, ViewStyle } from 'react-native';

import { styles } from './styles';

type FeedbackProps = {
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  title: string;
  autoHide?: boolean;
  autoHideDuration?: number;
  fadeDuration?: number;
};

export class Feedback extends React.Component<FeedbackProps> {
  static defaultProps = {
    containerStyle: styles.defaultStyles,
    titleStyle: styles.defaultStyles,
    title: 'Something went wrong.',
    autoHide: true,
    autoHideDuration: 3000,
    fadeDuration: 300,
  };

  state = {
    opacity: new Animated.Value(0),
  };

  autoHideTimeout?: ReturnType<typeof setTimeout>;

  componentWillUnmount() {
    clearTimeout(this.autoHideTimeout);
  }

  show = () => {
    const { autoHide, fadeDuration, autoHideDuration } = this.props;
    const { opacity } = this.state;
    Animated.timing(opacity, {
      toValue: 1,
      duration: fadeDuration,
      useNativeDriver: true,
    }).start();
    if (autoHide) {
      this.autoHideTimeout = setTimeout(this.hide, autoHideDuration);
    }
  };

  hide = () => {
    const { fadeDuration } = this.props;
    const { opacity } = this.state;
    Animated.timing(opacity, {
      toValue: 0,
      duration: fadeDuration,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const { title, containerStyle, titleStyle } = this.props;
    const { opacity } = this.state;
    return (
      <Animated.View style={[styles.container, { opacity }, containerStyle]}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </Animated.View>
    );
  }
}
