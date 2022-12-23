import React from 'react';
import { View, FlatList } from 'react-native';
import { ContentListHeader } from './ContentListHeader';
import { ItemRenderer } from './ItemRenderer';
import { styles } from './styles';

interface ContentListProps {
  title: string;
  data?: unknown[];
  onPress(...args: unknown[]): unknown;
  dark?: boolean;
  showViewAll?: boolean;
}

export const ContentList = ({
  title,
  data,
  onPress,
  dark = false,
  showViewAll = true,
  ...props
}: ContentListProps) => (
  // console.log('data is', title, data);
  <View style={[styles.contentListContainer, dark ? styles.darkBg : styles.lightBg]}>
    <ContentListHeader dark={dark} title={title} onPress={onPress} showViewAll={showViewAll} />
    <FlatList
      horizontal
      data={data}
      ListHeaderComponent={() => <View style={{ width: 10 }} />}
      renderItem={({ item }) => <ItemRenderer item={item} {...props} />}
    />
  </View>
);

ContentList.defaultProps = {
  data: [],
  dark: false,
  showViewAll: true,
};
