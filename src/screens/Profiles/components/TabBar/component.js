import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const TabBar = props => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tab}
    >
      {props.children}
    </ScrollView>
  </View>
);

export const TabBarLink = ({ onPress, label, isActive }) => (
  <TouchableOpacity onPress={onPress} style={styles.link}>
    <StyledText color={isActive ? 'dark' : 'grey'} size="xsmall" bold>{label}</StyledText>
  </TouchableOpacity>
);

TabBar.propTypes = {
  children: PropTypes.node,
};

TabBar.defaultProps = {
  children: null,
  autoPadContent: true,
  minHorizontalPadding: 4,
};

TabBarLink.propTypes = {
  onPress: PropTypes.func,
  label: PropTypes.string,
  isActive: PropTypes.bool,
};

TabBarLink.defaultProps = {
  onPress: null,
  label: '',
  isActive: false,
};
