import * as React from 'react';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export const LibraryHeader = ({ libraryStatus, libraryType, listTitle, navigation, profile }) => {
  const viewAll = () => {
    navigation.navigate('UserLibraryList', {
      libraryStatus,
      libraryType,
      profile,
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

LibraryHeader.propTypes = {
  libraryStatus: PropTypes.string.isRequired,
  libraryType: PropTypes.string.isRequired,
  listTitle: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};
