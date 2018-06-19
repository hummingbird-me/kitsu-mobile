import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import { scene } from 'kitsu/screens/Profiles/constants';
import { isEmpty, isNull } from 'lodash';
import { styles } from './styles';

export class ImageGrid extends PureComponent {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
    heightToWidthRatio: PropTypes.number,
    width: PropTypes.number,
    compact: PropTypes.bool,
    imageBorderWidth: PropTypes.number,
    borderRadius: PropTypes.number,
    onImageTapped: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    images: [],
    heightToWidthRatio: Dimensions.get('window').width > 600 ? (3 / 4) : 1,
    width: null,
    compact: false,
    imageBorderWidth: 1,
    borderRadius: 0,
    onImageTapped: () => {},
    disabled: false,
  };

  renderImage(image, width, height, onPress, count = null) {
    if (isEmpty(image)) return null;

    const { imageBorderWidth, borderRadius, compact, disabled } = this.props;

    return (
      <TouchableOpacity
        key={`${image}-${width}`}
        style={[styles.imageWrap, { borderWidth: (compact ? 0 : imageBorderWidth) }]}
        onPress={onPress}
        disabled={disabled}
      >
        <PostImage
          uri={image}
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
        { !isNull(count) && count > 0 &&
          <View style={[styles.countContainer, { borderRadius }]}>
            <Text style={styles.countText}>+{count}</Text>
          </View>
        }
      </TouchableOpacity>
    );
  }

  renderImages(images) {
    const { heightToWidthRatio, width, compact, imageBorderWidth, onImageTapped } = this.props;

    // We only display maximum of 4 images at the moment
    // Or 1 image if compact
    let currentImages = images.length > 4 ? images.slice(0, 4) : images;
    if (compact) currentImages = [images[0]];

    // The width of the gallery
    const currentWidth = width || scene.width;
    const borderOffset = compact ? 0 : imageBorderWidth * 2;

    // Current Width to image width ratio
    // This is for the case when we have more than 1 image
    const ratio = 1 / Math.max(2, currentImages.length - 1);
    const ratioWidth = (currentWidth * ratio) - borderOffset;
    const ratioHeight = ratioWidth * heightToWidthRatio;

    /*
    This will produce the following:
    1 image -> 1 landscape image
    2 images -> 2 square images
    3 images -> 1 lanscape image + 2 square images
    4 images -> 1 landscape image + 3 square images + count on the last image
    */
    const imageComponents = currentImages.map((image, index) => {
      const isLandscapeImage = index === 0 && currentImages.length !== 2;
      const imageWidth = isLandscapeImage ? (currentWidth - borderOffset) : ratioWidth;
      const imageHeight = isLandscapeImage ? null : ratioHeight;

      // When in compact the count of currentImages is 1
      const count = (index === 3 || compact) ? images.length - currentImages.length : null;

      return this.renderImage(
        image,
        imageWidth,
        imageHeight,
        () => { onImageTapped(index); },
        count,
      );
    });

    return (
      <View style={styles.row}>
        {imageComponents}
      </View>
    );
  }

  render() {
    const { images } = this.props;

    // If we don't have anything to show then don't show it
    if (isEmpty(images)) return null;

    return this.renderImages(images);
  }
}
