import React, { PureComponent } from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import { scene } from 'kitsu/screens/Profiles/constants';
import { isEmpty, isNull } from 'lodash';
import { styles } from './styles';

interface ImageGridProps {
  images?: string[];
  heightToWidthRatio?: number;
  width?: number;
  compact?: boolean;
  imageBorderWidth?: number;
  borderRadius?: number;
  onImageTapped?(...args: unknown[]): unknown;
  disabled?: boolean;
}

export class ImageGrid extends PureComponent<ImageGridProps> {
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

  renderImage(image, width, height, onPress, count = null, showGIFOverlay = false) {
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

          // Only show the gif overlay if we're not showing the count
          showGIFOverlayForKitsu={showGIFOverlay && (isNull(count) || count === 0)}

          // If user has chosen to show the overlay and we are showing the count
          // We don't want the gif to animate
          showAnimatedGIF={!showGIFOverlay}
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

      /*
        We only show count IF:
          - We are showing the 4th image and we have more than 4 images
          - `compact` is set to `true` and more than 1 image is displaying
      */
      const shouldShowCount = (index === 3 && images.length > 4) || (compact && images.length > 1);

      // The text shown should count the image hidden by the overlay
      // E.g if we had 5 images then the count would show up as +2 since the 4th image is hidden by the text.
      const count = shouldShowCount ? (images.length - currentImages.length) + 1 : null;

      return this.renderImage(
        image,
        imageWidth,
        imageHeight,
        () => { onImageTapped(index); },
        count,
        // Only show the GIF overlay on images if we have more than 1 displaying
        currentImages.length > 1,
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
