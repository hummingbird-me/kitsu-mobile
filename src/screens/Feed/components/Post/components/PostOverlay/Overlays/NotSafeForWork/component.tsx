import React from 'react';

import { OverlayBase } from '../OverlayBase';

interface NotSafeForWorkProps {
  onPress?(...args: unknown[]): unknown;
}

export const NotSafeForWork = ({ onPress }: NotSafeForWorkProps) => (
  <OverlayBase
    onPress={onPress}
    foregroundText="This post contains NSFW content."
    backgroundText="ಠ_ಠ"
  />
);

NotSafeForWork.defaultProps = {
  onPress: null,
};
