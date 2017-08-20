import React from 'react';
import { Image, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from 'kitsu/components/ProgressBar';

import PropTypes from 'prop-types';

import styles from './styles';

const QuickUpdateCard = ({ data }) => {
  if (!data || !data.item || !data.item.anime || !data.item.unit || !data.item.unit.length) {
    return null;
  }

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
          <Text style={styles.episodeName} numberOfLines={1}>{unit[0].canonicalTitle}</Text>
        </Image>
      </View>

      {/* Card */}
      <View style={[styles.cardWrapper, styles.shadow]}>
        <View style={styles.cardHeaderArea}>
          <View style={styles.cardContent}>
            {/* Progress Bar */}
            <ProgressBar
              progress={data.item.progress / anime.episodeCount}
              style={styles.progressBar}
            />
            {/* Series Description */}
            <View style={styles.seriesDescriptionRow}>
              <Image style={styles.avatarImage} />
              <View style={styles.descriptionRow}>
                <Text style={styles.seriesTitle} numberOfLines={1}>{anime.canonicalTitle}</Text>
                <Text style={styles.seriesExtraInfo}>Anime • {anime.startDate.split('-')[0]}</Text>
              </View>
            </View>
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
