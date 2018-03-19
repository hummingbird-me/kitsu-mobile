import * as React from 'react';
import { PropTypes } from 'prop-types';
import { ScrollView, View, ImageBackground, Image } from 'react-native';
import { upperFirst } from 'lodash';
import { ohNo, mystery } from 'kitsu/assets/img/library';
import { StyledText } from 'kitsu/components/StyledText';
import { Button } from 'kitsu/components/Button';
import { styles } from './styles';

const STATUS_MAP = {
  anime: {
    current: 'you\'re currently watching',
    planned: 'you plan to watch',
    completed: 'you\'ve completed',
    on_hold: 'you have on hold',
    dropped: 'you have dropped',
  },
  manga: {
    current: 'you\'re currently reading',
    planned: 'you plan to read',
    completed: 'you\'ve completed',
    on_hold: 'you have on hold',
    dropped: 'you have dropped',
  },
};

const BUTTON_MAP = {
  anime: {
    current: 'Top Airing',
    planned: 'Upcoming',
    completed: 'Most Popular',
    on_hold: 'Most Popular',
    dropped: 'Most Popular',
  },
  manga: {
    current: 'Top Publishing',
    planned: 'Highest Rated',
    completed: 'Most Popular',
    on_hold: 'Most Popular',
    dropped: 'Most Popular',
  },
};

export const LibraryEmptyState = ({ type, status, onPress }) => {
  const statusText = STATUS_MAP[type][status];
  const buttonText = `${BUTTON_MAP[type][status]} ${upperFirst(type)}`;
  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          style={styles.imageBackground}
          imageStyle={{ resizeMode: 'contain' }}
          source={ohNo}
        >
          <Image style={styles.image} source={mystery} />
        </ImageBackground>
        <View style={styles.textContainer}>
          <StyledText textStyle={styles.text} color="black" size="large" bold>
            This Library Section is Empty!
          </StyledText>
          <StyledText textStyle={styles.text} color="grey" size="small">
            You're not tracking any of the {type} {statusText}. Let's find some!
          </StyledText>
        </View>
        <Button
          bold
          title={buttonText}
          onPress={onPress}
        />
      </View>
    </ScrollView>
  );
};
