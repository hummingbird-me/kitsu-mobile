import React from 'react';
import { Image, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

const QuickUpdatePage = ({ data }) => {
  const { anime } = data.item;

  return (
    <View key={data.item.id} style={styles.wrapper}>
      {/* Poster Image */}
      <View style={[styles.posterImageWrapper, styles.shadow]}>
        <Image
          source={{ uri: anime.posterImage.large }}
          style={styles.posterImage}
        />
      </View>
      {/* Card */}
      <View style={[styles.cardWrapper, styles.shadow]}>
        <View style={styles.cardContent}>
          <Text>{anime.canonicalTitle}</Text>
        </View>
      </View>
    </View>
  );
};

QuickUpdatePage.propTypes = {
  data: PropTypes.shape({
    item: PropTypes.shape({
      anime: {
        canonicalTitle: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        posterImage: {
          large: PropTypes.string.isRequired,
        },
      },
    }).isRequired,
  }).isRequired,
};

export default QuickUpdatePage;
