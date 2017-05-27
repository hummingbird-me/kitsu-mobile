import React, { Component } from 'react';
import { View } from 'react-native';
import { Spinner } from 'native-base';
import Animation from 'lottie-react-native';

const withSpinner = WrappedComponent =>
  class SpinnerComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        width: null,
        height: null,
      };
      this.renderAnimation = this.renderAnimation.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      console.log(this.animation);
      if (this.animation && nextProps.loading) {
        this.animation.play();
      }
    }

    renderAnimation() {
      const { lottie, spinner, lottieFactor } = this.props;
      const animStyle = {
        width: this.state.height / (lottieFactor || 4),
        height: this.state.height / (lottieFactor || 4),
      };
      if (this.props.lottie) {
        return (
          <View style={animStyle}>
            <Animation
              ref={(animation) => {
                this.animation = animation;
              }}
              style={animStyle}
              loop
              onLayout={(e) => {
                this.animation.play();
              }}
              source={this.props.lottie}
            />
          </View>
        );
      } else if (spinner) {
        return spinner;
      }
      return <Spinner size="large" color="grey" />;
    }
    render() {
      const { spinner, noSpinner, loading } = this.props;
      if (noSpinner) {
        return <WrappedComponent {...this.props} />;
      }
      return (
        <View
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            this.setState({ width, height });
          }}
        >
          <View style={{ opacity: this.props.loading ? 0.4 : 1 }}>
            <WrappedComponent {...this.props} />
          </View>
          {loading &&
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                width: this.state.width,
                height: this.state.height,
              }}
            >
              {this.renderAnimation()}
            </View>}
        </View>
      );
    }
  };

export default withSpinner;
