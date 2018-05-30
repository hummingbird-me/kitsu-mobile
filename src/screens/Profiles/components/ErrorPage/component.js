import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { StyledText } from 'kitsu/components/StyledText';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { styles } from './styles';

export const ErrorPage = ({ errorText, showHeader, onBackPress }) => (
  <SceneContainer>
    {showHeader && (
      <CustomHeader
        leftButtonAction={onBackPress}
        leftButtonTitle="Back"
      />
    )}
    <View style={styles.wrapper}>
      <StyledText color="light" textStyle={styles.text}>
        {errorText}
      </StyledText>
    </View>
  </SceneContainer>
);

ErrorPage.propTypes = {
  errorText: PropTypes.string,
  showHeader: PropTypes.bool,
  onBackPress: PropTypes.func.isRequired,
};

ErrorPage.defaultProps = {
  errorText: 'An Error Occurred',
  showHeader: true,
};
