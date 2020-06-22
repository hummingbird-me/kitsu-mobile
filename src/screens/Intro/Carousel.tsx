import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import Swiper from 'react-native-swiper';

import { white } from 'app/constants/colors';
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
        flex: 1,
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
      <Text
        style={{
          color: white,
          fontFamily: 'OpenSans_400Regular',
          fontSize: 17,
          textAlign: 'center',
        }}>
        {description}
      </Text>
    </View>
  );
}

export default function IntroCarousel({
  style,
  onViewFinalPage,
}: {
  style?: ViewStyle;
  onViewFinalPage?: Function;
}) {
  const [isFinalPage, setIsFinalPage] = useState(false);

  return (
    <Swiper
      onScroll={
        onViewFinalPage
          ? ({ nativeEvent: { contentOffset, layoutMeasurement } }) => {
              // Page number as a decimal, updated during scroll
              const progress = contentOffset.x / layoutMeasurement.width + 1;
              if (progress > SLIDES.length) {
                if (!isFinalPage) {
                  onViewFinalPage();
                }
                setIsFinalPage(true);
              } else {
                setIsFinalPage(false);
              }
            }
          : () => {}
      }
      scrollEventThrottle={50}
      style={style}
      loop={false}
      dotColor={white}
      dotStyle={{ height: 7, width: 7, margin: 2, opacity: 0.2 }}
      activeDotColor={white}
      activeDotStyle={{ height: 11, width: 11, margin: 0, borderRadius: 6 }}>
      {[...SLIDES.map(renderSlide), <View key="login"></View>]}
    </Swiper>
  );
}
