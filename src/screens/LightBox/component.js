import React, { PureComponent } from 'react';
import { ImageLightbox } from 'app/components/ImageLightbox';
import { Navigation } from 'react-native-navigation';
import { PropTypes } from 'prop-types';

export class LightBox extends PureComponent {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
    images: PropTypes.array,
    initialImageIndex: PropTypes.number,
  };

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
