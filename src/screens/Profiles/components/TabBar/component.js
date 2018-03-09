import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  TouchableOpacity,
  ViewPropTypes,
} from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const TabBar = props => (
  <View style={[styles.container, props.style]}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.tab, props.containerStyle]}
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
  style: ViewPropTypes.style,
  containerStyle: ViewPropTypes.style,
};

TabBar.defaultProps = {
  children: null,
  style: null,
  containerStyle: null,
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
