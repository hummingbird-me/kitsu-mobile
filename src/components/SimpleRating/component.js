import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import awful from 'kitsu/assets/img/ratings/awful.png';
import meh from 'kitsu/assets/img/ratings/meh.png';
import good from 'kitsu/assets/img/ratings/good.png';
import great from 'kitsu/assets/img/ratings/great.png';
import { styles } from './styles';

export const SimpleRating = ({ disabled, onRate, selected }) => (
  <View style={styles.ratingRow}>
    <TouchableOpacity onPress={() => onRate('awful')} disabled={disabled}>
      <View
        style={[
          styles.imageSimpleShadow,
          selected && selected !== 'awful' && styles.imageSimpleShadowBackground,
        ]}
      />
      <Image source={awful} style={styles.imageSimple} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onRate('meh')} disabled={disabled}>
      <View
        style={[
          styles.imageSimpleShadow,
          selected && selected !== 'meh' && styles.imageSimpleShadowBackground,
        ]}
      />
      <Image source={meh} style={styles.imageSimple} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onRate('good')} disabled={disabled}>
      <View
        style={[
          styles.imageSimpleShadow,
          selected && selected !== 'good' && styles.imageSimpleShadowBackground,
        ]}
      />
      <Image source={good} style={styles.imageSimple} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onRate('great')} disabled={disabled}>
      <View
        style={[
          styles.imageSimpleShadow,
          selected && selected !== 'great' && styles.imageSimpleShadowBackground,
        ]}
      />
      <Image source={great} style={styles.imageSimple} />
    </TouchableOpacity>
  </View>
);
