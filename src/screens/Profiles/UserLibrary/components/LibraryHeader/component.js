import * as React from 'react';
import { PropTypes } from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text, TouchableHighlight, View } from 'react-native';
import { styles } from './styles';

export const LibraryHeader = ({ title }) => {
  const viewAll = () => {
    console.log('view all!!!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.listTitleContainer}>
        <Text style={styles.listTitle}>{title}</Text>
      </View>

      <TouchableHighlight onPress={viewAll}>
        <View style={styles.viewAllContainer}>
          <Text style={styles.viewAllText}>View All</Text>
          <Icon name="chevron-right" style={styles.viewAllArrow} />
        </View>
      </TouchableHighlight>
    </View>
  );
};

LibraryHeader.propTypes = {
  title: PropTypes.string,
};

LibraryHeader.defaultProps = {
  title: '',
};
