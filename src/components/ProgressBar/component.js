import * as React from 'react';
import { Animated, View, ViewPropTypes } from 'react-native';
import { PropTypes } from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

export class ProgressBar extends React.Component {
  static propTypes = {
    backgroundStyle: ViewPropTypes.style,
    fillColor: PropTypes.string,
    fillPercentage: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    backgroundStyle: {},
    fillColor: colors.green,
    fillPercentage: 0,
    height: 5,
  };

  state = {
    fillPercentage: new Animated.Value(this.props.fillPercentage),
  };

  componentWillReceiveProps(nextProps) {
    this.update(nextProps.fillPercentage);
  }

  update(fillPercentage) {
    Animated.timing(this.state.fillPercentage, {
      toValue: fillPercentage,
    }).start();
  }

  render() {
    const fillStyle = {
      height: this.props.height,
      backgroundColor: this.props.fillColor,
      width: this.state.fillPercentage.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
      }),
      borderRadius: this.props.height,
    };

    return (
      <View
        style={[
          styles.background,
          this.props.backgroundStyle,
          { height: this.props.height, borderRadius: this.props.height },
        ]}
      >
        <Animated.View style={fillStyle} />
      </View>
    );
  }
}
