import React from 'react';
import PropTypes from 'prop-types';
import { OverlayBase } from '../OverlayBase';

export const Spoiler = ({ onPress }) => (
  <OverlayBase
    onPress={onPress}
    foregroundText="This post contains spoilers."
    backgroundText="(⊙_⊙)"
  />
);

Spoiler.propTypes = {
  onPress: PropTypes.func,
};

Spoiler.defaultProps = {
  onPress: null,
};
