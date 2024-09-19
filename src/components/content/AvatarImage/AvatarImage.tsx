import { type Image as ExpoImage } from 'expo-image';
import React from 'react';

import DEFAULT_AVATAR from '@/assets/img/default_avatar.png';
import Image, { type ImageProps } from '@/components/content/Image';

export { ImageFragment as AvatarImageFragment } from '@/components/content/Image';

export type AvatarImageProps = ImageProps & {
  size: number;
};

export default React.forwardRef<ExpoImage, AvatarImageProps>(
  function AvatarImage({ size, style, source, ...props }, ref) {
    source = source ?? {
      views: [{ url: DEFAULT_AVATAR, height: 190, width: 190 }],
      blurhash: 'UNGSJtogKQWB~qof9Zay4:of?GogIpof-okC',
    };
    return (
      <Image
        ref={ref}
        source={source}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
        {...props}
      />
    );
  }
);
