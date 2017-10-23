import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { SectionHeader } from 'kitsu/screens/Profiles/components/SectionHeader';
import { styles } from './styles';

const keyExtractor = (item, index) => index;

export const ScrollableSection = ({
  contentDark,
  title,
  titleAction,
  titleLabel,
  onViewAllPress,
  data,
  renderItem,
}) => (
  <View style={[styles.wrap, contentDark && styles.wrap__dark]}>
    <SectionHeader
      title={title}
      titleAction={titleAction}
      titleLabel={titleLabel}
      onViewAllPress={onViewAllPress}
      contentDark={contentDark}
    />
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      style={styles.list}
    />
  </View>
);

ScrollableSection.propTypes = {
  title: PropTypes.string,
  titleAction: PropTypes.func,
  titleLabel: PropTypes.string,
  contentDark: PropTypes.bool,
  onViewAllPress: PropTypes.func,
  data: PropTypes.array,
  renderItem: PropTypes.func,
};

ScrollableSection.defaultProps = {
  title: '',
  titleAction: null,
  titleLabel: '',
  contentDark: false,
  onViewAllPress: null,
  data: [],
  renderItem: null,
};
