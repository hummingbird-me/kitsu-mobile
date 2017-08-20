import React from 'react';
import { Image, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from 'kitsu/components/ProgressBar';

import PropTypes from 'prop-types';

import styles from './styles';

const QuickUpdateCard = ({ data }) => {
  const { anime, unit } = data.item;

  return (
    <View key={data.item.id} style={styles.wrapper}>
      {/* Poster Image */}
      <View style={[styles.posterImageWrapper, styles.shadow]}>
        <Image
          source={{ uri: anime.posterImage.large }}
          style={styles.posterImage}
        >
          <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.8)']} style={styles.posterImageGradient} />
          <View style={styles.episodeRow}>
            <Text style={styles.currentEpisodeText}>Ep. {data.item.progress}</Text>
            <Text style={styles.totalEpisodesText}> of {anime.episodeCount}</Text>
          </View>
          <Text style={styles.episodeName}>{unit[0].canonicalTitle}</Text>
        </Image>
      </View>

      {/* Card */}
      <View style={[styles.cardWrapper, styles.shadow]}>
        <View style={styles.cardHeaderArea}>
          <View style={styles.cardContent}>
            <ProgressBar
              progress={data.item.progress / anime.episodeCount}
              style={styles.progressBar}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

QuickUpdateCard.propTypes = {
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

export default QuickUpdateCard;
