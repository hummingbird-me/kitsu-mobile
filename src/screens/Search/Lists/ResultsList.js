import * as React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';

const IMAGE_SIZE = { height: 125, width: 91 };

const styles = StyleSheet.create({
  container: { backgroundColor: '#FAFAFA' },
  list: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linearGradient: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '40%',
    justifyContent: 'flex-end',
  },
  titleText: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 12,
    fontFamily: 'OpenSans',
    fontWeight: '600',
    padding: 3,
  },
});

const ResultsList = ({ hits, hasMore, refine, onPress }) => {
  const onEndReached = () => {
    if (hasMore) {
      refine();
    }
  };
  return (
    <FlatList
      removeClippedSubviews={false}
      data={hits}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
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
    />
  );
};

ResultsList.propTypes = {
  hits: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

const renderItem = ({ item }, onPress) => {
  let title = null;
  if (item.titles) {
    title = item.titles.en || item.titles.en_jp;
  }
  const { height, width } = IMAGE_SIZE;
  const m = IMAGE_SIZE.m || 1;
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View
        style={{
          height: height - m * 2,
          width: width - m * 2,
          margin: m,
        }}
        onPress={() => onPress(item)}
      >
        <ProgressiveImage
          onPress={() => onPress(item)}
          source={{ uri: (item.posterImage || {}).small }}
          style={{
            height: height - m * 2,
            width: width - m * 2,
          }}
        />
        {title &&
          <LinearGradient colors={['transparent', 'black']} style={styles.linearGradient}>
            <Text style={styles.titleText} numberOfLines={2}>
              {title}
            </Text>
          </LinearGradient>}
      </View>
    </TouchableOpacity>
  );
};

export default ResultsList;
