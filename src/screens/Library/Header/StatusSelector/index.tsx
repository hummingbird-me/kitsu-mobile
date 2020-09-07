import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Trans } from 'react-i18next';
import _ from 'lodash';
import { RectButton } from 'react-native-gesture-handler';

import Touchable from 'app/components/Touchable';
import { LibraryEntryStatus, Media_Type as MediaType } from 'app/types/graphql';

import fetchLibraryCounts from './fetchLibraryCounts';
import styles from './styles';

function StatusTabBarItem({
  mediaType,
  status,
  selected,
  count,
  onPress,
}: {
  mediaType: MediaType;
  status: LibraryEntryStatus;
  selected: boolean;
  count: number;
  onPress: (name: LibraryEntryStatus) => void;
}) {
  const i18nKey = `library.statusWithCount.${mediaType.toLowerCase()}.${status.toLowerCase()}`;

  return (
    <RectButton
      key={status}
      onPress={() => onPress(status)}
      rippleColor="white"
      style={[styles.tabItem, selected && styles.tabItem__selected]}>
      <Text style={[styles.statusText, selected && styles.tabText__selected]}>
        <Trans i18nKey={i18nKey} count={count}>
          Status <Text style={styles.countText}>({{ count }})</Text>
        </Trans>
      </Text>
    </RectButton>
  );
}

export default function LibraryStatusSelector({
  mediaType,
  selected,
  onSelect,
}: {
  mediaType: MediaType;
  selected: LibraryEntryStatus;
  onSelect: (status: LibraryEntryStatus) => void;
}) {
  const { loading, data } = fetchLibraryCounts({ mediaType });

  return (
    <ScrollView
      horizontal
      style={styles.tabBar}
      showsHorizontalScrollIndicator={false}>
      {loading
        ? null
        : _.map(data, (count: number, status: LibraryEntryStatus) => (
            <StatusTabBarItem
              mediaType={mediaType}
              status={status}
              count={count}
              selected={status === selected ? true : false}
              onPress={() => onSelect(status)}
              key={status}
            />
          ))}
    </ScrollView>
  );
}
