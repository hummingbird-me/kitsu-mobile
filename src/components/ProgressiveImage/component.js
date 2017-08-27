import * as React from 'react';
import { PropTypes } from 'prop-types';
import { View, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { commonStyles } from 'kitsu/common/styles';
import { styles } from './styles';

export class ProgressiveImage extends React.Component {
  static propTypes = {
    backgroundStyle: PropTypes.object,
    children: PropTypes.object,
    duration: PropTypes.number,
    style: PropTypes.any,
    resizeMode: PropTypes.string,
    source: PropTypes.object.isRequired,
  };

  static defaultProps = {
    backgroundStyle: undefined,
    children: undefined,
    duration: 300,
    style: undefined,
    resizeMode: 'cover',
  };

  state = {
    thumbnailOpacity: new Animated.Value(0),
    width: 0,
    height: 0,
  };

  onLoad = () => {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: this.props.duration,
    }).start();
  };

  onLayout = (event) => {
    const { height, width } = event.nativeEvent.layout;
    this.setState({ height, width });
  }

  render() {
    const { thumbnailOpacity } = this.state;
    const { backgroundStyle, children, style, resizeMode, source } = this.props;

    return (
      <View style={[styles.imageBackground, backgroundStyle, style]} >
        {source.uri &&
          <Animated.Image
            onLoad={this.onLoad}
            onLayout={this.onLayout}
            resizeMode={resizeMode}
            source={source}
            style={[style, { opacity: thumbnailOpacity }]}
          />
        }

        {children && source.uri &&
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={[commonStyles.absoluteFill, style]}
          >
            {children}
          </LinearGradient>
        }
      </View>
    );
  }
}
