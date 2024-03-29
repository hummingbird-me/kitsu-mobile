import * as React from 'react';
import { Animated, View, ViewStyle } from 'react-native';

import * as colors from 'kitsu/constants/colors';

import { styles } from './styles';

type ProgressBarProps = {
  backgroundStyle?: ViewStyle;
  fillColor?: string;
  fillPercentage: number;
  height?: number;
};

type ProgressBarState = {
  fillPercentage: Animated.Value;
};

export class ProgressBar extends React.Component<
  ProgressBarProps,
  ProgressBarState
> {
  static defaultProps = {
    backgroundStyle: {},
    fillColor: colors.green,
    fillPercentage: 0,
    height: 5,
  };

  state = {
    fillPercentage: new Animated.Value(this.props.fillPercentage),
  };

  UNSAFE_componentWillReceiveProps(nextProps: ProgressBarProps) {
    this.update(nextProps.fillPercentage);
  }

  update(fillPercentage: number) {
    Animated.timing(this.state.fillPercentage, {
      toValue: fillPercentage,
      useNativeDriver: false,
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
        ]}>
        <Animated.View style={fillStyle} />
      </View>
    );
  }
}
