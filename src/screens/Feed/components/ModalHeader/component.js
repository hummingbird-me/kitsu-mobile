import React from 'react';
import PropTypes from 'prop-types';
import { StyledText } from 'kitsu/components/StyledText';
import { HeaderButton } from 'kitsu/screens/Feed/components/HeaderButton';
import { View } from 'react-native';
import { styles } from './styles';

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
}) => (
  <View style={styles.modalHeader}>
    <View style={styles.modalButton}>
      <HeaderButton
        onPress={leftButtonAction}
        title={leftButtonTitle}
        disabled={leftButtonDisabled}
        loading={leftButtonLoading}
      />
    </View>
    <View style={styles.modalTitle}>
      <StyledText color="light" size="small" bold>{title}</StyledText>
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

ModalHeader.propTypes = {
  title: PropTypes.string,
  leftButtonTitle: PropTypes.string,
  leftButtonAction: PropTypes.func,
  leftButtonDisabled: PropTypes.bool,
  leftButtonLoading: PropTypes.bool,
  rightButtonTitle: PropTypes.string,
  rightButtonAction: PropTypes.func,
  rightButtonDisabled: PropTypes.bool,
  rightButtonLoading: PropTypes.bool,
};

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
};
