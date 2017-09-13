import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MediaCard } from 'kitsu/components/MediaCard';
import { styles } from './styles';

const ContentListHeader = ({ title, dark, ...props }) => (
  <View style={styles.contentListHeaderContainer}>
    <Text style={[styles.contentListHeaderText, dark ? styles.lightText : '']}>{title}</Text>
    <TouchableOpacity style={styles.contentListActionLink} {...props}>
      <Text style={[styles.contentListActionLinkText, dark ? styles.lightText : '']}>View All</Text>
      <Icon
        name="chevron-right"
        style={[styles.linkIcon, dark ? styles.iconLight : styles.iconDark]}
      />
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

export const ContentList = ({ title, data, onPress, dark = false, ...props }) => (
  // console.log('data is', title, data);
  <View style={[styles.contentListContainer, dark ? styles.darkBg : styles.lightBg]}>
    <ContentListHeader dark={dark} title={title} onPress={onPress} />
    <FlatList
      horizontal
      removeClippedSubviews={false}
      data={data}
      renderItem={({ item }) => <ItemRenderer item={item} {...props} />}
    />
  </View>
);

ContentList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
  onPress: PropTypes.func.isRequired,
  dark: PropTypes.bool,
};

ContentList.defaultProps = {
  data: [],
  dark: false,
};
