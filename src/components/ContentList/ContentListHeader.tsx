import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './styles';

export const ContentListHeader = ({ title, dark, showViewAll, ...props }) => (
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

ContentListHeader.propTypes = {
  title: PropTypes.string.isRequired,
  dark: PropTypes.bool.isRequired,
  showViewAll: PropTypes.bool,
};

ContentListHeader.defaultProps = {
  showViewAll: true,
};
