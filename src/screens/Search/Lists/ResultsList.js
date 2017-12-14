import * as React from 'react';
import { Dimensions, View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';

const IMAGE_SIZE = { width: 110, height: 160 };

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
    borderRadius: 3,
  },
  titleText: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 11,
    fontFamily: 'OpenSans',
    padding: 2,
  },
  touchCountainer: {
    flex: 1,
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  viewContainer: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
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
    numColumns={3}
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

  const imageWidth = IMAGE_SIZE.width;
  const imageHeight = IMAGE_SIZE.height;

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.touchCountainer}>
      <View style={[styles.viewContainer, { width: imageWidth }]}>
        <ProgressiveImage
          source={{ uri: imageSource }}
          style={{
            height: imageHeight,
            width: imageWidth,
            borderRadius: 3,
          }}
        />
        {title && (
          <LinearGradient colors={['transparent', 'black']} style={styles.linearGradient}>
            <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </LinearGradient>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ResultsList;
