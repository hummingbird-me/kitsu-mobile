import React from 'react';
import { FlatList, FlatListProps, View } from 'react-native';

import { ContentListHeader } from './ContentListHeader';
import { ItemRenderer } from './ItemRenderer';
import { styles } from './styles';

type ContentListProps<T> = {
  title: string;
  data?: FlatListProps<T>['data'];
  onPress(...args: unknown[]): unknown;
  dark?: boolean;
  showViewAll?: boolean;
};

export function ContentList<T>({
  title,
  data = [],
  onPress,
  dark = false,
  showViewAll = true,
  ...props
}: ContentListProps<T>): JSX.Element {
  // console.log('data is', title, data);
  return (
    <View
      style={[
        styles.contentListContainer,
        dark ? styles.darkBg : styles.lightBg,
      ]}>
      <ContentListHeader
        dark={dark}
        title={title}
        onPress={onPress}
        showViewAll={showViewAll}
      />
      <FlatList
        horizontal
        data={data}
        ListHeaderComponent={() => <View style={{ width: 10 }} />}
        renderItem={({ item }) => <ItemRenderer item={item} {...props} />}
      />
    </View>
  );
}
