import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { orange } from 'kitsu/constants/colors';
import StyledText from 'kitsu/screens/Profiles/parts/StyledText';

const StyledPill = glamorous.view(
  {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
  },
  ({ color }) => ({ backgroundColor: color }),
);

const Pill = ({ color, label }) => (
  <StyledPill color={color}>
    <StyledText color="light" size="xsmall">{label}</StyledText>
  </StyledPill>
);

Pill.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
};

Pill.defaultProps = {
  color: orange,
  label: '',
};

export default Pill;
