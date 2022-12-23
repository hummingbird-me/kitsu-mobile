import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

interface CustomHeaderProps {
  leftButtonAction?(...args: unknown[]): unknown;
  leftButtonTitle?: string;
  rightButtonAction?(...args: unknown[]): unknown;
  rightButtonTitle?: string;
  title?: string;
  backgroundColor?: string;
}

export const CustomHeader = ({
  title,
  leftButtonTitle,
  leftButtonAction,
  rightButtonTitle,
  rightButtonAction,
  backgroundColor
}: CustomHeaderProps) => (
  <View style={[styles.headerView, { backgroundColor }]}>
    <View style={[styles.buttonView, styles.buttonView__left]}>
      {leftButtonAction && (
        <TouchableOpacity onPress={leftButtonAction} style={styles.button}>
          <Icon name="ios-arrow-back" style={styles.buttonIcon} />
          {leftButtonTitle && <StyledText color="light" size="small" textStyle={styles.buttonTitle}>{leftButtonTitle}</StyledText>}
        </TouchableOpacity>
      )}
    </View>
    {title && (
      <View style={styles.titleView}>
        <StyledText color="light" size="default" bold>{title}</StyledText>
      </View>
    )}
    <View style={[styles.buttonView, styles.buttonView__right]}>
      {rightButtonAction && (
        <TouchableOpacity onPress={rightButtonAction} style={styles.button}>
          {rightButtonTitle && <StyledText color="light" size="small" textStyle={styles.buttonTitle}>{rightButtonTitle}</StyledText>}
        </TouchableOpacity>
      )}
    </View>
  </View>
);


CustomHeader.defaultProps = {
  leftButtonAction: null,
  leftButtonTitle: null,
  rightButtonAction: null,
  rightButtonTitle: null,
  title: null,
  backgroundColor: 'transparent',
};
