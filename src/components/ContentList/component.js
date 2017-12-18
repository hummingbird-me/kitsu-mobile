import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { ContentListHeader } from './ContentListHeader';
import { ItemRenderer } from './ItemRenderer';
import { styles } from './styles';

export const ContentList = ({ title, data, onPress, dark = false, showViewAll = true, ...props }) => (
  // console.log('data is', title, data);
  <View style={[styles.contentListContainer, dark ? styles.darkBg : styles.lightBg]}>
    <ContentListHeader dark={dark} title={title} onPress={onPress} showViewAll={showViewAll} />
    <FlatList
      horizontal
      removeClippedSubviews={false}
      data={data}
      ListHeaderComponent={() => <View style={{ width: 10 }} />}
      renderItem={({ item }) => <ItemRenderer item={item} {...props} />}
      keyExtractor={(item, index) => index}
    />
  </View>
);

ContentList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
  onPress: PropTypes.func.isRequired,
  dark: PropTypes.bool,
  showViewAll: PropTypes.bool,
};

ContentList.defaultProps = {
  data: [],
  dark: false,
  showViewAll: true,
};
