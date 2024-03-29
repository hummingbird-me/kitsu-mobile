import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { StyledText } from 'kitsu/components/StyledText';
import { orange } from 'kitsu/constants/colors';

import { styles } from './styles';

interface PillProps {
  color?: string;
  label?: string;
  onPress?(...args: unknown[]): unknown;
}

export const Pill = ({ color, label, onPress }: PillProps) => {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      style={[styles.pill, { backgroundColor: color }]}
      onPress={onPress}
    >
      <StyledText color="light" size="xsmall">
        {label}
      </StyledText>
    </Container>
  );
};

Pill.defaultProps = {
  color: orange,
  label: '',
  onPress: null,
};
