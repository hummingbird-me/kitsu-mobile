import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import React from 'react';
import { Animated, Text } from 'react-native';

import { styles } from './styles';

interface FeedbackProps {
  containerStyle?: unknown;
  titleStyle?: unknown;
  title: string;
  autoHide?: boolean;
  autoHideDuration?: number;
  fadeDuration?: number;
}

export class Feedback extends React.Component<FeedbackProps> {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    titleStyle: ViewPropTypes.style,
  };

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

  componentWillUnmount() {
    clearTimeout(this.autoHideTimeout);
  }

  show = () => {
    const { autoHide, fadeDuration, autoHideDuration } = this.props;
    const { opacity } = this.state;
    Animated.timing(opacity, { toValue: 1, duration: fadeDuration }).start();
    if (autoHide) {
      this.autoHideTimeout = setTimeout(this.hide, autoHideDuration);
    }
  };

  hide = () => {
    const { fadeDuration } = this.props;
    const { opacity } = this.state;
    Animated.timing(opacity, { toValue: 0, duration: fadeDuration }).start();
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
