import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MediaCard } from 'kitsu/components/MediaCard';
import { styles } from './styles';

const ContentListHeader = ({ title, dark }) => (
  <View style={styles.contentListHeaderContainer}>
    <Text style={[styles.contentListHeaderText, dark ? styles.lightText : '']}>{title}</Text>
    <TouchableOpacity style={styles.contentListActionLink}>
      <Text style={[styles.contentListActionLinkText, dark ? styles.lightText : '']}>View All</Text>
    </TouchableOpacity>
  </View>
);

ContentListHeader.propTypes = {
  title: PropTypes.string.isRequired,
  dark: PropTypes.bool.isRequired,
};

const MEDIA_CARD_DIMENSIONS = { height: 120, width: 80 };

const ItemRenderer = ({ item, ...props }) => {
  if (item.type === 'streamers') {
    return (
      <Text style={styles.lightText} {...props}>
        {item.siteName}
      </Text>
    );
  }
  return <MediaCard cardDimensions={MEDIA_CARD_DIMENSIONS} mediaData={item} {...props} />;
};

export const ContentList = ({ title, data, onItemPress, dark = false }) => {
  console.log('data is', title, data);
  return (
    <View style={[styles.contentListContainer, dark ? styles.darkBg : styles.lightBg]}>
      <ContentListHeader dark={dark} title={title} />
      <FlatList
        horizontal
        removeClippedSubviews={false}
        data={data}
        renderItem={({ item }) => <ItemRenderer item={item} onPress={onItemPress} />}
      />
    </View>
  );
};

ContentList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
  onItemPress: PropTypes.func.isRequired,
  dark: PropTypes.func,
};

ContentList.defaultProps = {
  data: [],
};
