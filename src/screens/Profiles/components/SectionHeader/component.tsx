import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

interface SectionTitleProps {
  contentDark?: boolean;
  title?: string;
  titleAction?(...args: unknown[]): unknown;
  titleLabel?: string;
}

export const SectionTitle = ({
  contentDark,
  title,
  titleAction,
  titleLabel
}: SectionTitleProps) => (
  <View style={styles.main}>
    <StyledText bold size="xsmall" color={contentDark ? 'dark' : 'lightGrey'}>{title}</StyledText>
    {(titleAction && titleLabel) && (
      <TouchableOpacity onPress={titleAction} style={styles.link}>
        <StyledText bold size="xsmall" color={contentDark ? 'dark' : 'light'}>・</StyledText>
        <StyledText bold size="xsmall" color={contentDark ? 'yellow' : 'yellow'}>{titleLabel}</StyledText>
      </TouchableOpacity>
    )}
  </View>
);

SectionTitle.defaultProps = {
  contentDark: false,
  title: '',
  titleAction: null,
  titleLabel: '',
};

interface SectionHeaderProps {
  contentDark?: boolean;
  onViewAllPress?(...args: unknown[]): unknown;
  title?: string;
  titleAction?(...args: unknown[]): unknown;
  titleLabel?: string;
  viewAllText?: string;
}

export const SectionHeader = ({
  contentDark,
  title,
  titleAction,
  titleLabel,
  onViewAllPress,
  viewAllText
}: SectionHeaderProps) => (
  <View style={styles.wrap}>
    <SectionTitle
      contentDark={contentDark}
      title={title}
      titleAction={titleAction}
      titleLabel={titleLabel}
    />
    {onViewAllPress && (
      <TouchableOpacity onPress={onViewAllPress} style={styles.link}>
        <StyledText color={contentDark ? 'dark' : 'light'} size="xsmall" bold>{viewAllText || 'View All'}</StyledText>
        <Icon name="ios-arrow-forward" style={[styles.icon, contentDark && styles.icon__contentDark]} />
      </TouchableOpacity>
    )}
  </View>
);

SectionHeader.defaultProps = {
  contentDark: false,
  onViewAllPress: null,
  title: '',
  titleAction: null,
  titleLabel: '',
  viewAllText: 'View All',
};
