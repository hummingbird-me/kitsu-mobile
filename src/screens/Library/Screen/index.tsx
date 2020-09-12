import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import _ from 'lodash';

import { MainNavigatorScreenProps } from 'app/navigation/MainNavigator';
import EmptyState from 'app/components/LibraryList/EmptyState';
import { LibraryEntryStatusEnum, MediaTypeEnum } from 'app/types/graphql';

export default function LibraryScreen({
  navigation,
  route,
}: MainNavigatorScreenProps<'Library'>) {
  const {
    type = MediaTypeEnum.Anime,
    status = LibraryEntryStatusEnum.Current,
  } = route.params ?? {};

  return (
    <View>
      <ScrollView>
        <View style={{ height: 10000 }}>
          <EmptyState mediaType={type} status={status} />
          <Text>Placeholder stuff</Text>
        </View>
      </ScrollView>
    </View>
  );
}
