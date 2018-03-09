import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import awful from 'kitsu/assets/img/ratings/awful.png';
import meh from 'kitsu/assets/img/ratings/meh.png';
import good from 'kitsu/assets/img/ratings/good.png';
import great from 'kitsu/assets/img/ratings/great.png';
import { styles } from './styles';

export const SimpleRating = ({ disabled, onRate, selected, imageStyle, shadowStyle }) => {
  const imageSimpleStyle = [styles.imageSimple, imageStyle];
  const imageSimpleShadowBackground = [styles.imageSimpleShadowBackground, shadowStyle];
  return (
    <View style={styles.ratingRow}>
      <TouchableOpacity onPress={() => onRate('awful')} disabled={disabled}>
        <View
          style={[
            styles.imageSimpleShadow,
            selected && selected !== 'awful' && imageSimpleShadowBackground,
            imageStyle,
          ]}
        />
        <FastImage source={awful} style={imageSimpleStyle} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onRate('meh')} disabled={disabled}>
        <View
          style={[
            styles.imageSimpleShadow,
            selected && selected !== 'meh' && imageSimpleShadowBackground,
            imageStyle,
          ]}
        />
        <FastImage source={meh} style={imageSimpleStyle} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onRate('good')} disabled={disabled}>
        <View
          style={[
            styles.imageSimpleShadow,
            selected && selected !== 'good' && imageSimpleShadowBackground,
            imageStyle,
          ]}
        />
        <FastImage source={good} style={imageSimpleStyle} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onRate('great')} disabled={disabled}>
        <View
          style={[
            styles.imageSimpleShadow,
            selected && selected !== 'great' && imageSimpleShadowBackground,
            imageStyle,
          ]}
        />
        <FastImage source={great} style={imageSimpleStyle} />
      </TouchableOpacity>
    </View>
  );
};
