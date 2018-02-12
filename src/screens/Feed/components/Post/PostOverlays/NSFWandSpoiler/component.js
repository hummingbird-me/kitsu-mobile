import React from 'react';
import PropTypes from 'prop-types';
import { OverlayBase } from '../OverlayBase';

export const NSFWandSpoiler = ({ onPress }) => (
  <OverlayBase
    onPress={onPress}
    foregroundText="Contains spoilers and NSFW."
    backgroundText="ಠ_ಠ"
  />
);

NSFWandSpoiler.propTypes = {
  onPress: PropTypes.func,
};

NSFWandSpoiler.defaultProps = {
  onPress: null,
};
