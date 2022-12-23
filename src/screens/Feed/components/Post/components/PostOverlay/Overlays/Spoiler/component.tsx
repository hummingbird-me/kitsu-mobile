import React from 'react';

import { OverlayBase } from '../OverlayBase';

interface SpoilerProps {
  onPress?(...args: unknown[]): unknown;
}

export const Spoiler = ({ onPress }: SpoilerProps) => (
  <OverlayBase
    onPress={onPress}
    foregroundText="This post contains spoilers."
    backgroundText="(⊙_⊙)"
  />
);

Spoiler.defaultProps = {
  onPress: null,
};
