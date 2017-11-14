import React from 'react';
import PropTypes from 'prop-types';
import { OverlayBase } from '../OverlayBase';

export const NotSafeForWork = ({ onPress }) => (
  <OverlayBase
    onPress={onPress}
    foregroundText="This post contains NSFW content."
    backgroundText="ಠ_ಠ"
  />
);

NotSafeForWork.propTypes = {
  onPress: PropTypes.func,
};

NotSafeForWork.defaultProps = {
  onPress: null,
};
