import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as colors from '../../../constants/colors';
import ProgressiveImage from '../../../components/ProgressiveImage';

const ResultsList = ({ dataArray, loadMore, refreshing = false, refresh }) => (
  <View style={{ backgroundColor: '#FAFAFA' }}>
    <FlatList
      removeClippedSubviews={false}
      data={dataArray}
      onEndReached={() => loadMore()}
      onEndReachedThreshold={0.5}
      getItemLayout={(data, index) => ({
        length: 125,
        offset: 125 * index,
        index,
      })}
      initialNumToRender={10}
      numColumns={4}
      refreshing={refreshing}
      onRefresh={() => refresh()}
      contentContainerStyle={styles.list}
      renderItem={renderItem}
    />
  </View>
  );

const renderItem = ({ item }) => {
  let title = null;
  if (item.titles) {
    title = item.titles.en || item.titles.en_jp;
  }
  return (
    <View style={{ height: 125, width: 91, margin: 1 }}>
      <ProgressiveImage
        source={{ uri: item.image }}
        containerStyle={{
          height: 125,
          width: 91,
          backgroundColor: colors.imageGrey,
        }}
        style={{ height: 125, width: 91 }}
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
            }}
            numberOfLines={2}
          >
            {title}
          </Text>
        </LinearGradient>}
    </View>
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
    width: '100%',
    height: '40%',
    justifyContent: 'flex-end',
    padding: 5,
  },
};

export default ResultsList;
