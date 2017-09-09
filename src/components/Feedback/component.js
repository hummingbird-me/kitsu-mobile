import React from 'react';
import { Animated, Text, ViewPropTypes } from 'react-native';
import { PropTypes } from 'prop-types';
import { styles } from './styles';

export class Feedback extends React.Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    titleStyle: ViewPropTypes.style,
    title: PropTypes.string.isRequired,
    autoHide: PropTypes.bool,
    autoHideDuration: PropTypes.number,
    fadeDuration: PropTypes.number,
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
  }

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
  }

  hide = () => {
    const { fadeDuration } = this.props;
    const { opacity } = this.state;
    Animated.timing(opacity, { toValue: 0, duration: fadeDuration }).start();
  }

  render() {
    const { title, containerStyle, titleStyle } = this.props;
    const { opacity } = this.state;
    return (
      <Animated.View style={[styles.container, { opacity }, containerStyle]}>
        <Text style={[styles.title, titleStyle]}>
          {title}
        </Text>
      </Animated.View>
    );
  }
}
