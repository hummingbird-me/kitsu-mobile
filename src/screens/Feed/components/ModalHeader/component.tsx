import React from 'react';
import { View } from 'react-native';

import { StyledText } from 'kitsu/components/StyledText';
import { HeaderButton } from 'kitsu/screens/Feed/components/HeaderButton';

import { styles } from './styles';

interface ModalHeaderProps {
  title?: string;
  leftButtonTitle?: string;
  leftButtonAction?(...args: unknown[]): unknown;
  leftButtonDisabled?: boolean;
  leftButtonLoading?: boolean;
  rightButtonTitle?: string;
  rightButtonAction?(...args: unknown[]): unknown;
  rightButtonDisabled?: boolean;
  rightButtonLoading?: boolean;
  style?: object;
}

export const ModalHeader = ({
  title,
  leftButtonTitle,
  leftButtonAction,
  leftButtonDisabled,
  leftButtonLoading,
  rightButtonTitle,
  rightButtonAction,
  rightButtonDisabled,
  rightButtonLoading,
  style,
}: ModalHeaderProps) => (
  <View style={[styles.modalHeader, style]}>
    <View style={styles.modalButton}>
      <HeaderButton
        onPress={leftButtonAction}
        title={leftButtonTitle}
        disabled={leftButtonDisabled}
        loading={leftButtonLoading}
      />
    </View>
    <View style={styles.modalTitle}>
      <StyledText color="light" size="small" bold>
        {title}
      </StyledText>
    </View>
    <View style={[styles.modalButton, styles.modalRightButton]}>
      <HeaderButton
        onPress={rightButtonAction}
        highlighted
        title={rightButtonTitle}
        disabled={rightButtonDisabled}
        loading={rightButtonLoading}
      />
    </View>
  </View>
);

ModalHeader.defaultProps = {
  title: '',
  leftButtonTitle: 'Cancel',
  leftButtonAction: null,
  leftButtonDisabled: false,
  leftButtonLoading: false,
  rightButtonTitle: 'Done',
  rightButtonAction: null,
  rightButtonDisabled: false,
  rightButtonLoading: false,
  style: null,
};
