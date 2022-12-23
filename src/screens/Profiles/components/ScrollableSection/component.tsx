import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { SectionHeader } from 'kitsu/screens/Profiles/components/SectionHeader';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

const keyExtractor = (item, index) => index.toString();

interface ScrollableSectionProps {
  title?: string;
  titleAction?(...args: unknown[]): unknown;
  titleLabel?: string;
  contentDark?: boolean;
  onViewAllPress?(...args: unknown[]): unknown;
  data?: unknown[];
  renderItem?(...args: unknown[]): unknown;
  loading?: boolean;
}

export const ScrollableSection = ({
  contentDark,
  title,
  titleAction,
  titleLabel,
  onViewAllPress,
  data,
  renderItem,
  loading
}: ScrollableSectionProps) => (
  <View style={[styles.wrap, contentDark && styles.wrap__dark]}>
    <SectionHeader
      title={title}
      titleAction={titleAction}
      titleLabel={titleLabel}
      onViewAllPress={onViewAllPress}
      contentDark={contentDark}
    />
    {loading ?
      <View style={{ height: 120 }}>
        <View style={styles.loading}>
          <ActivityIndicator color={contentDark ? colors.darkPurple : colors.transparentWhite} />
        </View>
      </View>
      :
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        style={styles.list}
      />

    }
  </View>
);

ScrollableSection.defaultProps = {
  title: '',
  titleAction: null,
  titleLabel: '',
  contentDark: false,
  onViewAllPress: null,
  data: [],
  renderItem: null,
  loading: false,
};
