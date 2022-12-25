import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles';

type ContentListHeaderProps = {
  title: string;
  dark: boolean;
  showViewAll?: boolean;
};

export const ContentListHeader = ({
  title,
  dark,
  showViewAll = true,
  ...props
}: ContentListHeaderProps) => (
  <View style={styles.contentListHeaderContainer}>
    <Text
      style={[styles.contentListHeaderText, dark ? styles.lightText : null]}>
      {title}
    </Text>
    {showViewAll && (
      <TouchableOpacity style={styles.contentListActionLink} {...props}>
        <Text
          style={[
            styles.contentListActionLinkText,
            dark ? styles.lightText : null,
          ]}>
          View All
        </Text>
        <Icon
          name="chevron-right"
          style={[styles.linkIcon, dark ? styles.iconLight : styles.iconDark]}
        />
      </TouchableOpacity>
    )}
  </View>
);
