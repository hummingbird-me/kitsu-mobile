import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import _ from 'lodash';

import { MainNavigatorScreenProps } from 'app/navigation/MainNavigator';
import EmptyState from 'app/components/LibraryList/EmptyState';
import { LibraryEntryStatus, Media_Type as MediaType } from 'app/types/graphql';

export default function LibraryScreen({
  navigation,
  route,
}: MainNavigatorScreenProps<'Library'>) {
  const { type = MediaType.Anime, status = LibraryEntryStatus.Current } =
    route.params ?? {};

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
