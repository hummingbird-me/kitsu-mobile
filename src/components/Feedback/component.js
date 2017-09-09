import React from 'react';
import { Animated, Text, ViewPropTypes } from 'react-native';
import { PropTypes } from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

export class Feedback extends React.Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    titleStyle: ViewPropTypes.style,
    title: PropTypes.string.isRequired,
    autoHide: PropTypes.bool,
    autoHideDuration: PropTypes.number,
    duration: PropTypes.number,
  };

  static defaultProps = {
    containerStyle: styles.defaultStyles,
    titleStyle: styles.defaultStyles,
    title: 'Something went wrong.',
    autoHide: true,
    autoHideDuration: 4000,
    duration: 300,
  };

  state = {
    opacity: new Animated.Value(0),
  }

  componentWillUnmount() {
    clearTimeout(this.autoHideTimeout);
  }

  show = () => {
    const { autoHide, duration, autoHideDuration } = this.props;
    const { opacity } = this.state;
    Animated.timing(opacity, { toValue: 1, duration }).start();
    if (autoHide) {
      this.autoHideTimeout = setTimeout(this.hide, autoHideDuration);
    }
  }

  hide = () => {
    const { duration } = this.props;
    const { opacity } = this.state;
    Animated.timing(opacity, { toValue: 0, duration }).start();
  }

  render() {
    const { containerStyle, title } = this.props;
    return (
      <Animated.View style={[styles.container, { opacity: this.state.opacity }, containerStyle]}>
        <Text style={[styles.title, styles.titleStyle]}>
          {title}
        </Text>
      </Animated.View>
    );
  }
}
