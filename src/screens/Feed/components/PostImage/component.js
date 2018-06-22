import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Dimensions, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { styles } from './styles';

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
    originalWidth: 0,
    originalHeight: 0,
    loading: true,
  }

  componentWillMount() {
    this.mounted = true;
    this.updateImageSize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.uri !== nextProps.uri) {
      this.updateImageSize();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateImageSize() {
    // We have to default to using `Image.getSize` for iOS
    // Because in fast image 4.0.14 it fails to give us width and height in the `onLoad` event.
    if (Platform.OS === 'android') return;

    Image.getSize(this.props.uri, (width, height) => {
      if (!this.mounted) return;

      this.setState({
        originalWidth: width,
        originalHeight: height,
        loading: false,
      });
    });
  }

  mounted = false

  /*
  Calculate the size of the image.
  */
  calculateSize() {
    const { maxAutoHeight, width: propWidth, height: propHeight } = this.props;
    const { originalWidth, originalHeight, loading } = this.state;

    const isWidthSet = !!propWidth;
    const isHeightSet = !!propHeight;

    // The max width to clip view if `width` is not set and `height` is set
    const maxAutoWidth = Dimensions.get('window').width;

    // Image ratio
    // These may not be set so we need to make sure we don't divide by 0
    const ratio = (originalHeight || 0) / (originalWidth || 1);

    // The default dimensions if we haven't finished loading the image
    const defaultWidth = propWidth || maxAutoWidth;
    const defaultHeight = propHeight || Math.min(defaultWidth * (3 / 4), maxAutoHeight);

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
    const { width, height, autoHeight } = this.calculateSize();

    return (
      <FastImage
        // If height is automatically set and it goes over the max auto height
        // We need to make sure that the image is displayed in full to the user.
        resizeMode={(autoHeight && height >= maxAutoHeight) ? 'contain' : 'cover'}
        source={{ uri }}
        style={{ width, height, borderRadius, overflow: 'hidden', backgroundColor: '#fcfcfc' }}
        onLoad={(e) => {
          // Currently on fast image version 4.0.14, it doesn't return image sizes in the load event for iOS
          // Remove this once we update to the latest version
          if (Platform.OS === 'ios') {
            this.setState({ loading: false });
            return;
          }

          const size = e.nativeEvent;
          this.setState({
            originalWidth: (size.width || 0),
            originalHeight: (size.height || 0),
            loading: false,
          });
        }}
      />
    );
  }
}

export const PostImageSeparator = () => <View style={styles.separator} />;
