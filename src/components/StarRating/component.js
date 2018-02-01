import React from 'react';
import { View, Slider, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

export const StarRating = ({
  ratingTwenty,
  ratingSystem,
  sliderValueChanged,
  onSlidingComplete,
}) => (
  <View>
    {/* Star, 4.5 */
      ratingTwenty ? (
        <View style={styles.modalStarRow}>
          <Icon name="star" size={46} color={colors.yellow} />
          <Text style={styles.modalRatingText}>
            {getRatingTwentyProperties(ratingTwenty, ratingSystem).text}
          </Text>
        </View>
      ) : (
        <View style={styles.modalStarRow}>
          <Text style={styles.modalNoRatingText}>Slide to rate</Text>
        </View>
      )}
    {/* Slider */}
    <Slider
      minimumValue={ratingSystem === 'regular' ? 0 : 1}
      maximumValue={20}
      step={ratingSystem === 'regular' ? 2 : 1}
      value={ratingTwenty || 0}
      minimumTrackTintColor={colors.tabRed}
      maximumTrackTintColor={'rgb(43, 33, 32)'}
      onValueChange={sliderValueChanged}
      onSlidingComplete={onSlidingComplete}
      style={styles.modalSlider}
    />
  </View>
);

function getRatingTwentyProperties(ratingTwenty, type) {
  const ratingProperties = {};
  const rating = displayRatingFromTwenty(ratingTwenty, type);

  switch (type) {
    case 'advanced':
      ratingProperties.text = rating >= 10 ? rating : rating.toFixed(1);
      ratingProperties.textStyle = styles.textStar;
      break;
    case 'regular':
      ratingProperties.text = rating >= 5 ? rating : rating.toFixed(1);
      ratingProperties.textStyle = styles.textStar;
      break;
    case 'simple':
    default:
      if (rating < 6) {
        ratingProperties.text = 'AWFUL';
        ratingProperties.textStyle = styles.textAwful;
      } else if (rating < 10) {
        ratingProperties.text = 'MEH';
        ratingProperties.textStyle = styles.textMeh;
      } else if (rating < 16) {
        ratingProperties.text = 'GOOD';
        ratingProperties.textStyle = styles.textGood;
      } else {
        ratingProperties.text = 'GREAT';
        ratingProperties.textStyle = styles.textGreat;
      }
      break;
  }

  return ratingProperties;
}

function displayRatingFromTwenty(ratingTwenty, type) {
  if (type === 'regular') {
    return Math.round(ratingTwenty / 2) / 2;
  } else if (type === 'advanced') {
    return ratingTwenty / 2;
  } else if (type === 'simple') {
    return ratingTwenty;
  }

  throw new Error(`Unknown rating type ${type}.`);
}
