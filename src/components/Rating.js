import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

const styleForRating = (rating, image) => {
  if (rating < 3) {
    return image === 'awful' ? 'selected' : 'default';
  } else if (rating < 5) {
    return image === 'meh' ? 'selected' : 'default';
  } else if (rating < 8) {
    return image === 'good' ? 'selected' : 'default';
  }

  return image === 'great' ? 'selected' : 'default';
};

const Rating = props =>
(
  <View style={styles.wrapper}>
    <TouchableOpacity onPress={() => props.onRatingChanged(2)}>
      <Image source={require('../assets/img/ratings/awful.png')} style={styles[styleForRating(props.rating, 'awful')]} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => props.onRatingChanged(4)}>
      <Image source={require('../assets/img/ratings/meh.png')} style={styles[styleForRating(props.rating, 'meh')]} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => props.onRatingChanged(7)}>
      <Image source={require('../assets/img/ratings/good.png')} style={styles[styleForRating(props.rating, 'good')]} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => props.onRatingChanged(10)}>
      <Image source={require('../assets/img/ratings/great.png')} style={styles[styleForRating(props.rating, 'great')]} />
    </TouchableOpacity>
  </View>
);

Rating.propTypes = {
  rating: PropTypes.number,
  onRatingChanged: PropTypes.func,
};

Rating.defaultProps = {
  rating: 10, // Let's be optimistic, shall we?
  onRatingChanged: () => {},
};

const styles = {
  wrapper: {
    flexDirection: 'row',
  },
  selected: {
    width: 50,
    height: 50,
    margin: 3,
  },
  default: {
    width: 50,
    height: 50,
    margin: 3,
    opacity: 0.4,
  },
};

export default Rating;
