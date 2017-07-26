import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressiveImage from '../../../components/ProgressiveImage';

const ResultsList = ({
  dataArray,
  loadMore,
  refreshing = false,
  onPress,
  refresh,
  scrollEnabled = true,
  numColumns = 4,
  imageSize = { h: 125, w: 91 },
}) => (
  <View style={{ backgroundColor: '#FAFAFA' }}>
    <FlatList
      removeClippedSubviews={false}
      data={dataArray}
      onEndReached={() => loadMore()}
      onEndReachedThreshold={0.5}
      getItemLayout={(data, index) => ({
        length: imageSize.h,
        offset: imageSize.h * index,
        index,
      })}
      initialNumToRender={10}
      numColumns={numColumns}
      scrollEnabled={scrollEnabled}
      refreshing={refreshing}
      onRefresh={() => refresh()}
      contentContainerStyle={styles.list}
      renderItem={e => renderItem(e, imageSize, onPress)}
    />
  </View>
);

const renderItem = ({ item }, imageSize, onPress) => {
  let title = null;
  if (item.titles) {
    title = item.titles.en || item.titles.en_jp;
  }
  const { h, w } = imageSize;
  const m = imageSize.m || 1;
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View
        style={{
          height: h - (m * 2),
          width: w - (m * 2),
          margin: m,
        }}
        onPress={() => onPress(item)}
      >
        <ProgressiveImage
          onPress={() => onPress(item)}
          source={{ uri: item.image }}
          style={{
            height: h - (m * 2),
            width: w - (m * 2),
          }}
        />
        {title &&
          <LinearGradient colors={['transparent', 'black']} style={styles.linearGradient}>
            <Text
              style={{
                color: 'white',
                backgroundColor: 'transparent',
                fontSize: 12,
                fontFamily: 'OpenSans',
                fontWeight: '600',
                padding: 3,
              }}
              numberOfLines={2}
            >
              {title}
            </Text>
          </LinearGradient>}
      </View>
    </TouchableOpacity>
  );
};

ResultsList.propTypes = {
  dataArray: PropTypes.array.isRequired,
  loadMore: PropTypes.func,
  refresh: PropTypes.func,
  refreshing: PropTypes.bool,
};

ResultsList.defaultProps = {
  loadMore: () => {},
  refresh: () => {},
  onPress: () => {},
  refreshing: false,
};

const styles = {
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
};

export default ResultsList;
