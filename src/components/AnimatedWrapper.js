import React, { PureComponent } from 'react';
import { View, Dimensions } from 'react-native';
import { Image } from 'react-native-animatable';

export default class AnimatedWrapped extends PureComponent {
  state = {
    ind: 0,
    scale: 1,
  };

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    const s1 = this.state.scale || 1;
    const s2 = s1 === 1 ? 1.1 : 1;
    const tx2 = (Math.floor(Math.random() * 6) - 3) * 2;
    const ty2 = (Math.floor(Math.random() * 6) - 3) * 2;
    if (this.image) {
      this.image.transition(
        { opacity: 0, scale: s1, translateX: 0, translateY: 0 },
        { opacity: 0.6, scale: 1.05, translateX: tx2 / 2, translateY: ty2 / 2 },
        animDuration,
        'ease-in',
      );
      setTimeout(
        () =>
          this.image &&
          this.image.transition(
            {
              opacity: 0.6,
              scale: 1.05,
              translateX: tx2 / 2,
              translateY: ty2 / 2,
            },
            { opacity: 0, scale: s2, translateX: tx2, translateY: ty2 },
            animDuration,
            'ease-out',
          ),
        animDuration - 10,
      );
      setTimeout(this.startAnimation, 2 * animDuration - 400);
      const ind = this.state.ind === images.length - 1 ? 0 : this.state.ind + 1;
      this.setState({ ind, scale: s2 });
    }
  };
  render() {
    const { ind } = this.state;
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          height: 600,
          overflow: 'hidden',
          backgroundColor: '#372836',
        }}
      >
        <Image
          ref={el => (this.image = el)}
          style={{
            opacity: 0.4,
            width: Dimensions.get('window').width,
            height: 600,
          }}
          resizeMode="cover"
          source={images[ind]}
        />
      </View>
    );
  }
}

/* eslint-disable global-require */
const animDuration = 3000;
const images = [
  require('../assets/img/posters/fullmetal.jpg'),
  require('../assets/img/posters/fullmetal2.png'),
  require('../assets/img/posters/naruto2.jpg'),
  require('../assets/img/posters/deatnote.jpg'),
];
/* eslint-enable global-require */
