import React from 'react';
import { Text, View, Image, ImageSourcePropType } from 'react-native';
import Swiper from 'react-native-swiper';

import { white, transparentWhite } from 'app/constants/colors';
import slide1 from 'app/assets/img/intro/slide1.png';
import slide2 from 'app/assets/img/intro/slide2.png';
import slide3 from 'app/assets/img/intro/slide3.png';
import slide4 from 'app/assets/img/intro/slide4.png';

const SLIDES = [
  {
    title: 'More of what you love',
    description:
      'Get recommendations to discover your next favorite anime or manga!',
    image: slide1,
  },
  {
    title: 'Track Your Progress',
    description:
      "Log and rate what you've seen and read to build a library of your history.",
    image: slide2,
  },
  {
    title: 'Join The Community',
    description:
      'Kitsu makes finding new like-minded friends easy with the global activity feed.',
    image: slide3,
  },
  {
    title: 'Share Your Reactions',
    description:
      'Check the media ratings and review from other users and leave your own!',
    image: slide4,
  },
];

function renderSlide({
  image,
  title,
  description,
}: {
  image: ImageSourcePropType;
  title: string;
  description: string;
}) {
  return (
    <View
      key={title}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <Image source={image} />
      <Text
        style={{
          color: white,
          fontFamily: 'Asap_700Bold',
          fontSize: 20,
          textTransform: 'uppercase',
        }}>
        {title}
      </Text>
      <Text style={{ color: white }}>{description}</Text>
    </View>
  );
}

export default function IntroCarousel() {
  return (
    <Swiper loop={false} dotColor={transparentWhite} activeDotColor={white}>
      {[
        ...SLIDES.map(renderSlide),
        <View key="login">
          <Text>Login page</Text>
        </View>,
      ]}
    </Swiper>
  );
}
