import * as React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

export const LibraryHeader = ({ data, title, type }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text>{title}</Text>
      </View>

      <View>
        <Text>View All</Text>
      </View>
    </View>
  );
};
