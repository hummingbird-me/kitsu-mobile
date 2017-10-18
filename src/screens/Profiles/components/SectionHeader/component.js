import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const SectionHeader = ({
  contentDark,
  title,
  titleAction,
  titleLabel,
  onViewAllPress,
}) => (
  <View style={styles.wrap}>
    <View style={styles.main}>
      <StyledText bold size="xsmall" color={contentDark ? 'dark' : 'lightGrey'}>{title}</StyledText>
      {(titleAction && titleLabel) && (
        <TouchableOpacity onPress={titleAction} style={styles.link}>
          <StyledText bold size="xsmall" color={contentDark ? 'dark' : 'light'}>・</StyledText>
          <StyledText bold size="xsmall" color={contentDark ? 'yellow' : 'yellow'}>{titleLabel}</StyledText>
        </TouchableOpacity>
      )}
    </View>
    {onViewAllPress && (
      <TouchableOpacity onPress={onViewAllPress} style={styles.link}>
        <StyledText color={contentDark ? 'dark' : 'light'} size="xsmall" bold>View All</StyledText>
        <Icon name="ios-arrow-forward" style={[styles.icon, contentDark && styles.icon__contentDark]} />
      </TouchableOpacity>
    )}
  </View>
);

SectionHeader.propTypes = {
  contentDark: PropTypes.bool,
  onViewAllPress: PropTypes.func,
  title: PropTypes.string,
  titleAction: PropTypes.element,
  titleLabel: PropTypes.string,
};

SectionHeader.defaultProps = {
  contentDark: false,
  onViewAllPress: null,
  title: '',
  titleAction: null,
  titleLabel: '',
};
