import React from 'react';
import { OverlayBase } from '../OverlayBase';

interface NSFWandSpoilerProps {
  onPress?(...args: unknown[]): unknown;
}

export const NSFWandSpoiler = ({
  onPress
}: NSFWandSpoilerProps) => (
  <OverlayBase
    onPress={onPress}
    foregroundText="Contains spoilers and NSFW."
    backgroundText="ಠ_ಠ"
  />
);

NSFWandSpoiler.defaultProps = {
  onPress: null,
};
