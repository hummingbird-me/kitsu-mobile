import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './styles';

interface ContentListHeaderProps {
  title: string;
  dark: boolean;
  showViewAll?: boolean;
}

export const ContentListHeader = ({
  title,
  dark,
  showViewAll,
  ...props
}: ContentListHeaderProps) => (
  <View style={styles.contentListHeaderContainer}>
    <Text style={[styles.contentListHeaderText, dark ? styles.lightText : '']}>{title}</Text>
    {showViewAll && <TouchableOpacity style={styles.contentListActionLink} {...props}>
      <Text style={[styles.contentListActionLinkText, dark ? styles.lightText : '']}>View All</Text>
      <Icon
        name="chevron-right"
        style={[styles.linkIcon, dark ? styles.iconLight : styles.iconDark]}
      />
    </TouchableOpacity>}
  </View>
);

ContentListHeader.defaultProps = {
  showViewAll: true,
};
