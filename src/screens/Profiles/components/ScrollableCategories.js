import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import { Pill } from 'kitsu/screens/Profiles/parts';
import { scenePadding } from 'kitsu/screens/Profiles/constants';

const ScrollableCategories = ({ categories }) => (
  <FlatList
    style={{ marginTop: scenePadding }}
    contentContainerStyle={{ paddingLeft: scenePadding, marginLeft: -5 }}
    horizontal
    showsHorizontalScrollIndicator={false}
    data={categories}
    renderItem={({ item }) => <View style={{ marginLeft: 5 }}><Pill label={item.title} /></View>}
  />
);

ScrollableCategories.propTypes = {
  categories: PropTypes.array,
};

ScrollableCategories.defaultProps = {
  categories: [],
};

export default ScrollableCategories;
