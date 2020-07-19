import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  ImageSourcePropType,
  ViewStyle,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

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

const styles = StyleSheet.create({
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingLeft: 26,
    paddingRight: 26,
  },
  slideTitle: {
    color: white,
    fontFamily: 'Asap_700Bold',
    fontSize: 20,
    textTransform: 'uppercase',
    marginTop: 26,
  },
  slideDescription: {
    color: white,
    fontFamily: 'OpenSans_400Regular',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 5,
  },
});

function renderSlide({
  image,
  title,
  description,
  width,
}: {
  image: ImageSourcePropType;
  title: string;
  description: string;
  width: number;
}) {
  return (
    <View key={title} style={{ ...styles.slideContainer, width }}>
      <Image source={image} />
      <Text style={styles.slideTitle}>{title}</Text>
      <Text style={styles.slideDescription}>{description}</Text>
    </View>
  );
}

export default function IntroCarousel({ style }: { style?: ViewStyle }) {
  const { width: windowWidth } = useWindowDimensions();

  // 2 2.25 3
  const [progress, setProgress] = useState(0);

  // 2
  const negativeIndex = Math.floor(progress);
  // 3
  const positiveIndex = Math.ceil(progress);
  // [0, 0, 0.75, 0.25, 0]
  const dotLevel = [...SLIDES, null].map((_, index) => {
    if (index === progress) {
      return 1;
    } else if (index === negativeIndex) {
      return positiveIndex - progress;
    } else if (index === positiveIndex) {
      return progress - negativeIndex;
    } else {
      return 0;
    }
  });

  const dots = dotLevel.map((level, index) => {
    const opacity = level * 0.8 + 0.2;
    const scale = level * 0.5 + 1;
    return (
      <View style={{ marginLeft: 4 }} key={index}>
        <View
          style={{
            height: 7 * scale,
            width: 7 * scale,
            margin: (11 - 7 * scale) / 2,
            borderRadius: 10,
            backgroundColor: white,
            opacity,
          }}
        />
      </View>
    );
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        ...style,
      }}>
      <View style={{ flex: 4 }}>
        <ScrollView
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={({ nativeEvent: { contentOffset, layoutMeasurement } }) => {
            // Page number as a decimal, updated during scroll
            setProgress(contentOffset.x / layoutMeasurement.width);
          }}
          style={style}
          scrollEventThrottle={50}>
          {[
            ...SLIDES.map((slide) =>
              renderSlide({ ...slide, width: windowWidth })
            ),
          ]}
        </ScrollView>
      </View>
      <View
        style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
        key="Dots">
        {dots}
      </View>
    </View>
  );
}
