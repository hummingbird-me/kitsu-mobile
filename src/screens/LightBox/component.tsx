import React, { PureComponent } from 'react';
import { ImageLightbox } from 'kitsu/components/ImageLightbox';
import { Navigation } from 'react-native-navigation';

interface LightBoxProps {
  componentId: any;
  images?: unknown[];
  initialImageIndex?: number;
}

export class LightBox extends PureComponent<LightBoxProps> {
  static defaultProps = {
    images: [],
    initialImageIndex: 0,
  }

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
