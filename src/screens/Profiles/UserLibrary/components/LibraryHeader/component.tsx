import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Screens } from 'kitsu/navigation';

import { styles } from './styles';

interface LibraryHeaderProps {
  libraryStatus: string;
  libraryType: string;
  listTitle: string;
  componentId: any;
  profile: object;
}

export const LibraryHeader = ({
  libraryStatus,
  libraryType,
  listTitle,
  componentId,
  profile,
}: LibraryHeaderProps) => {
  const viewAll = () => {
    Navigation.push(componentId, {
      component: {
        name: Screens.PROFILE_LIBRARY_LIST,
        passProps: {
          libraryStatus,
          libraryType,
          profile,
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.listTitleContainer}>
        <Text style={styles.listTitle}>{listTitle}</Text>
      </View>

      <TouchableOpacity onPress={viewAll}>
        <View style={styles.viewAllContainer}>
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="chevron-right" style={styles.viewAllArrow} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
