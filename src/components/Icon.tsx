import React, { ComponentProps } from 'react';
import { createIconSetFromFontello } from 'react-native-vector-icons';

import config from 'kitsu/assets/fonts/icons/config.json';

const Icon = createIconSetFromFontello(config);

interface iconProps {
  name: string;
  size?: number;
  color?: string;
  styles?: ComponentProps<typeof Icon>['style'];
}

const icon = ({
  name,
  size = 12,
  color = '#000000',
  styles = {},
}: iconProps) => <Icon name={name} size={size} color={color} style={styles} />;

export default icon;
