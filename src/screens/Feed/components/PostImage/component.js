import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Dimensions, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { styles } from './styles';
import { ImageSizeCache } from 'kitsu/utils/cache';

export class PostImage extends PureComponent {
  static propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    borderRadius: PropTypes.number,
    // The maximum height an image can be if the width is set and height is not set.
    maxAutoHeight: PropTypes.number,
  };

  static defaultProps = {
    width: null,
    height: null,
    borderRadius: 0,
    maxAutoHeight: 400,
  };

  state = {
    width: this.props.width || 0,
    height: this.props.height || 0,
    autoHeight: false,
    loading: true,
  }

  componentWillMount() {
    this.mounted = true;
    this.fetchImageSize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.uri !== nextProps.uri ||
        this.props.width !== nextProps.width ||
        this.props.height !== nextProps.height
    ) {
      this.fetchImageSize();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchImageSize() {
    const uri = this.props.uri;

    // Get the cached size first, if not then load it in
    if (ImageSizeCache.contains(uri)) {
      const size = ImageSizeCache.get(uri) || {};
      const imageSize = this.calculateSize(size.width, size.height, false);
      this.setState({
        loading: false,
        ...imageSize,
      });
    } else {
      const { originalWidth, originalHeight, loading } = this.state;
      const imageSize = this.calculateSize(originalWidth, originalHeight, loading);
      this.setState({ ...imageSize });

      // TODO: Convert this to a onLoad function for FastImage
      // It's not done at the moment because on iOS the `onLoad` function doesn't pass in image dimensions
      Image.getSize(uri, (width, height) => {
        if (!this.mounted) return;

        ImageSizeCache.set(uri, width, height);

        const newImageSize = this.calculateSize(width, height, false);
        this.setState({
          loading: false,
          ...newImageSize,
        });
      });
    }
  }

  mounted = false

  /*
  Calculate the size of the image.
  */
  calculateSize(originalWidth, originalHeight, loading) {
    const { maxAutoHeight, width: propWidth, height: propHeight } = this.props;

    const isWidthSet = !!propWidth;
    const isHeightSet = !!propHeight;

    // The max width to clip view if `width` is not set and `height` is set
    const maxAutoWidth = Dimensions.get('window').width;

    // Image ratio
    // These may not be set so we need to make sure we don't divide by 0
    const ratio = (originalHeight || 0) / (originalWidth || 1);

    // The default dimensions if we haven't finished loading the image
    const defaultWidth = propWidth || maxAutoWidth;
    const defaultHeight = propHeight || Math.min(defaultWidth / 2, maxAutoHeight);

    // Return values
    let width = 0;
    let height = 0;
    let autoHeight = false;

    // Calculate the possibilities
    if (isWidthSet && isHeightSet) {
      // User has set both width and height
      width = propWidth;
      height = propHeight;
    } else if (loading) {
      // If we haven't loaded the image then use default values
      width = defaultWidth;
      height = defaultHeight;
    } else if (isWidthSet && !isHeightSet) {
      // User has set the width but not the height
      width = propWidth;
      height = Math.min(maxAutoHeight, propWidth * ratio);
      autoHeight = true;
    } else if (!isWidthSet && isHeightSet) {
      // User has set the height but not the width
      width = Math.min(maxAutoWidth, propHeight * (1 / ratio));
      height = propHeight;
    } else {
      // User hasn't set the anything
      width = originalWidth;
      height = originalHeight;
    }

    return {
      width,
      height,
      autoHeight,
    };
  }

  render() {
    const { uri, borderRadius, maxAutoHeight } = this.props;
    const { loading, width, height, autoHeight } = this.state;

    return (
      <View>
        {loading &&
          <View style={[styles.loadingContainer, { borderRadius }]}>
            <ActivityIndicator color="white" />
          </View>
        }
        <FastImage
          // If height is automatically set and it goes over the max auto height
          // We need to make sure that the image is displayed in full to the user.
          resizeMode={(autoHeight && height >= maxAutoHeight) ? 'contain' : 'cover'}
          source={{ uri }}
          style={{
            width,
            height,
            borderRadius,
            overflow: 'hidden',
            backgroundColor: loading ? 'transparent' : '#fcfcfc',
          }}
          cache="web"
        />
      </View>
    );
  }
}

export const PostImageSeparator = () => <View style={styles.separator} />;
