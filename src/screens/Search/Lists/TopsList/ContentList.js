import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MediaCard } from 'kitsu/components/MediaCard';
import { styles } from './styles';

const ContentListHeader = ({ title }) => (
  <View style={styles.contentListHeaderContainer}>
    <Text style={styles.contentListHeaderText}>{title}</Text>
    <TouchableOpacity style={styles.contentListActionLink}>
      <Text style={styles.contentListActionLinkText}>View All</Text>
    </TouchableOpacity>
  </View>
);

ContentListHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export const ContentList = ({ title, data }) => (
  <View style={styles.contentListContainer}>
    <ContentListHeader title={title} />
    <FlatList
      horizontal
      removeClippedSubviews={false}
      data={data}
      renderItem={({ item, index }) => (
        <MediaCard
          cardDimensions={{ height: 120, width: 80 }}
          mediaData={item}
          onPress={p => console.log('params', p)}
        />
      )}
    />
  </View>
);

ContentList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
};

ContentList.defaultProps = {
  data: [],
};
