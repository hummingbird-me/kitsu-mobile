import { Image } from 'expo-image';
import React, { ForwardedRef, forwardRef } from 'react';
import { useIntl } from 'react-intl';
import {
  ImageSourcePropType,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import slide1 from '@/assets/img/intro/slide1.png';
import slide2 from '@/assets/img/intro/slide2.png';
import slide3 from '@/assets/img/intro/slide3.png';
import slide4 from '@/assets/img/intro/slide4.png';
import { white } from '@/constants/colors';
import { Asap, OpenSans } from '@/constants/fonts';

import RegistrationSlide from './Registration';

function Slide({
  image,
  title,
  description,
}: {
  image: ImageSourcePropType;
  title: string;
  description: string;
}) {
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView key={title} style={{ ...styles.slideContainer, width }}>
      <View style={styles.slideSpacer} />
      <Image
        source={image}
        style={styles.slideImage}
        contentFit="contain"
        contentPosition="center"
      />
      <Text style={styles.slideTitle}>{title}</Text>
      <Text style={styles.slideDescription}>{description}</Text>
      <View style={styles.slideSpacer} />
    </SafeAreaView>
  );
}

export default Animated.createAnimatedComponent(
  forwardRef(function IntroCarousel(
    { style, ...props }: ScrollViewProps,
    ref: ForwardedRef<ScrollView>
  ) {
    const intl = useIntl();

    return (
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={[styles.carouselContainer, style]}
        {...props}>
        {/* If you add or remove slides make sure to update the math in the <IntroScreen /> component */}
        <Slide
          title={intl.formatMessage({
            defaultMessage: 'More of what you love',
            description: 'Intro -> Slide 1 -> Title',
          })}
          description={intl.formatMessage({
            defaultMessage:
              'Get recommendations to discover your next favorite anime or manga!',
            description: 'Intro -> Slide 1 -> Body Text',
          })}
          image={slide1}
        />
        <Slide
          title={intl.formatMessage({
            defaultMessage: 'Track Your Progress',
            description: 'Intro -> Slide 2 -> Title',
          })}
          description={intl.formatMessage({
            defaultMessage:
              "Log and rate what you've seen and read to build a library of your history.",
            description: 'Intro -> Slide 2 -> Body Text',
          })}
          image={slide2}
        />
        <Slide
          title={intl.formatMessage({
            defaultMessage: 'Join The Community',
            description: 'Intro -> Slide 3 -> Title',
          })}
          description={intl.formatMessage({
            defaultMessage:
              'Kitsu makes finding new like-minded friends easy with the global activity feed.',
            description: 'Intro -> Slide 3 -> Body Text',
          })}
          image={slide3}
        />
        <Slide
          title={intl.formatMessage({
            defaultMessage: 'Share Your Reactions',
            description: 'Intro -> Slide 4 -> Title',
          })}
          description={intl.formatMessage({
            defaultMessage:
              'Check the media ratings and review from other users and leave your own!',
            description: 'Intro -> Slide 4 -> Body Text',
          })}
          image={slide4}
        />
        <RegistrationSlide />
      </ScrollView>
    );
  })
);

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 4,
    paddingHorizontal: 26,
  },
  slideSpacer: {
    flex: 1,
  },
  slideImage: {
    flex: 1,
    width: '70%',
  },
  slideTitle: {
    color: white,
    fontFamily: Asap.bold,
    fontSize: 20,
    textTransform: 'uppercase',
    marginTop: 26,
  },
  slideDescription: {
    color: white,
    fontFamily: OpenSans.normal,
    fontSize: Platform.select({ ios: 18, android: 16 }),
    textAlign: 'center',
    marginTop: 5,
  },
});
