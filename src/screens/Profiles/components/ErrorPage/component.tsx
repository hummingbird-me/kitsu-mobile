import React from 'react';
import { View } from 'react-native';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { StyledText } from 'kitsu/components/StyledText';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { styles } from './styles';

interface ErrorPageProps {
  errorText?: string;
  showHeader?: boolean;
  onBackPress(...args: unknown[]): unknown;
}

export const ErrorPage = ({
  errorText,
  showHeader,
  onBackPress
}: ErrorPageProps) => (
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

ErrorPage.defaultProps = {
  errorText: 'An Error Occurred',
  showHeader: true,
};
