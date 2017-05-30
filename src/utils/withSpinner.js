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
      if (this.animation && nextProps.loading) {
        this.animation.play();
      }
    }

    renderAnimation() {
      const { lottie, spinner, lottieFactor } = this.props;
      let width = this.state.width;
      let height = this.state.height;
      if (lottieFactor !== 0) {
        width = this.state.height / (lottieFactor || 4);
        height = this.state.height / (lottieFactor || 4);
      }
      const animStyle = {
        width,
        height,
      };
      if (lottie) {
        return (
          <View style={animStyle}>
            <Animation
              ref={(animation) => {
                this.animation = animation;
              }}
              style={animStyle}
              loop
              onLayout={() => {
                this.animation.play();
              }}
              source={lottie}
            />
          </View>
        );
      } else if (spinner) {
        return spinner;
      }
      return <Spinner size="large" color="grey" />;
    }
    render() {
      const { noSpinner, loading } = this.props;
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
          <View style={{ opacity: loading ? 0.3 : 1 }}>
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
