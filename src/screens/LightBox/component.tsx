import React, { PureComponent } from 'react';
import { Navigation } from 'react-native-navigation';

import { ImageLightbox } from 'kitsu/components/ImageLightbox';

interface LightBoxProps {
  componentId: any;
  images?: unknown[];
  initialImageIndex?: number;
}

export class LightBox extends PureComponent<LightBoxProps> {
  static defaultProps = {
    images: [],
    initialImageIndex: 0,
  };

  static options() {
    return {
      layout: {
        backgroundColor: 'transparent',
      },
    };
  }

  render() {
    const { componentId, images, initialImageIndex } = this.props;

    return (
      <ImageLightbox
        visible
        images={images || []}
        initialImageIndex={initialImageIndex}
        onClose={() => {
          Navigation.dismissOverlay(componentId);
        }}
      />
    );
  }
}
