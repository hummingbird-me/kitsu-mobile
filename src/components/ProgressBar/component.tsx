import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import * as React from 'react';
import { Animated, View } from 'react-native';

import * as colors from 'kitsu/constants/colors';

import { styles } from './styles';

interface ProgressBarProps {
  backgroundStyle?: unknown;
  fillColor?: string;
  fillPercentage?: number;
  height?: number;
}

export class ProgressBar extends React.Component<ProgressBarProps> {
  static propTypes = {
    backgroundStyle: ViewPropTypes.style,
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

  UNSAFE_componentWillReceiveProps(nextProps) {
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
        <Animated.View style={fillStyle} useNativeDriver={true} />
      </View>
    );
  }
}
