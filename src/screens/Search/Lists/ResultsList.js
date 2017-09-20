import * as React from 'react';
import { Dimensions, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';

const IMAGE_SIZE = { height: 125, width: 91 };

const styles = StyleSheet.create({
  container: { backgroundColor: '#FAFAFA' },
  linearGradient: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 11,
    fontFamily: 'OpenSans',
    padding: 2,
  },
});

const ResultsList = ({ hits, onPress, ...props }) => (
  <FlatList
    removeClippedSubviews={false}
    data={hits}
    getItemLayout={(data, index) => ({
      length: IMAGE_SIZE.height,
      offset: IMAGE_SIZE.height * index,
      index,
    })}
    initialNumToRender={10}
    numColumns={4}
    scrollEnabled
    contentContainerStyle={styles.list}
    renderItem={e => renderItem(e, onPress)}
    style={styles.container}
    onEndReachedThreshold={0.5}
    {...props}
  />
);

ResultsList.propTypes = {
  hits: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
};

const renderItem = ({ item }, onPress) => {
  let title = null;
  const imageSource = item.image || (item.posterImage || {}).small;

  if (item.titles) {
    title = item.titles.en || item.titles.en_jp;
  }
  const { width } = Dimensions.get('window');
  const imageWidth = (width - 10) / 3;
  const imageHeight = 180;

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={{ padding: 2 }}>
      <ProgressiveImage
        source={{ uri: imageSource }}
        style={{
          height: imageHeight,
          width: imageWidth,
        }}
      />
      {title && (
        <LinearGradient colors={['transparent', 'black']} style={styles.linearGradient}>
          <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

export default ResultsList;
