import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text } from 'react-native';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import { scene } from 'kitsu/screens/Profiles/constants';
import { isEmpty, isNull } from 'lodash';
import { styles } from './styles';

export class ImageGrid extends PureComponent {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
      uri: PropTypes.string.isRequired,
    })),
    widthToHeightRatio: PropTypes.number,
    width: PropTypes.number,
    compact: PropTypes.bool,
    imageBorderWidth: PropTypes.number,
    borderRadius: PropTypes.number,
  };

  static defaultProps = {
    images: [],
    widthToHeightRatio: 1,
    width: null,
    compact: false,
    imageBorderWidth: 1,
    borderRadius: 0,
  };

  state = {
  }

  renderImage(image, width, height, count = null) {
    if (isEmpty(image) || isEmpty(image.uri)) return null;

    const { imageBorderWidth, borderRadius, compact } = this.props;

    return (
      <View style={[styles.imageWrap, { borderWidth: !compact && imageBorderWidth }]}>
        <PostImage
          uri={image.uri}
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
        { !isNull(count) && count > 0 &&
          <View style={[styles.countContainer, { borderRadius }]}>
            <Text style={styles.countText}>+{count}</Text>
          </View>
        }
      </View>
    );
  }

  render() {
    const { images, widthToHeightRatio, width, compact, imageBorderWidth } = this.props;

    // If we don't have anything to show then don't show it
    if (isEmpty(images)) return null;

    // We only display maximum of 4 images at the moment
    const currentImages = images.length > 4 ? images.slice(0, 4) : images;

    // The width of the gallery
    const currentWidth = width || scene.width;
    const borderOffset = imageBorderWidth * 2;

    // Current Width to image width ratio
    // This is for the case when we have more than 1 image
    const ratio = images.length > 3 ? (1 / 3) : (1 / 2);
    const ratioWidth = (currentWidth * ratio) - borderOffset;
    const ratioHeight = ratioWidth / widthToHeightRatio;

    // Compact view will just show the number straight up
    if (compact) {
      return this.renderImage(images[0], currentWidth, null, images.length - 1);
    }

    switch (currentImages.length) {
      case 1:
        // 1 landscape image
        return this.renderImage(images[0], currentWidth - borderOffset, null);
      case 2:
        // 2 square images
        return (
          <View style={styles.row}>
            {this.renderImage(images[0], ratioWidth, ratioHeight)}
            {this.renderImage(images[1], ratioWidth, ratioHeight)}
          </View>
        );
      case 3:
        // 1 landscape and 2 square images
        return (
          <View style={styles.row}>
            {this.renderImage(images[0], currentWidth - borderOffset, null)}
            {this.renderImage(images[1], ratioWidth, ratioHeight)}
            {this.renderImage(images[2], ratioWidth, ratioHeight)}
          </View>
        );
      default:
        // 1 landscape and 3 square images with a count on the last one
        return (
          <View style={styles.row}>
            {this.renderImage(images[0], currentWidth - borderOffset, null)}
            {this.renderImage(images[1], ratioWidth, ratioHeight)}
            {this.renderImage(images[2], ratioWidth, ratioHeight)}
            {this.renderImage(images[3], ratioWidth, ratioHeight, images.length - 4)}
          </View>
        );
    }
  }
}
