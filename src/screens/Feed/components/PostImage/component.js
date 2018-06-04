import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { styles } from './styles';

export class PostImage extends PureComponent {
  static propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    borderRadius: PropTypes.number,
  };

  static defaultProps = {
    size: 'default',
    width: null,
    height: null,
    borderRadius: 0,
  };

  state = {
    width: 0,
    height: 0,
  }

  componentWillMount() {
    this.mounted = true;
    this.updateImageSize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
      this.updateImageSize();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateImageSize() {
    const { width, height, uri } = this.props;
    if (width && height) {
      this.setState({ width: this.props.width, height: this.props.height });
    } else {
      Image.getSize(uri, (imageWidth, imageHeight) => {
        if (!this.mounted) return;

        if (width && !height) {
          this.setState({
            width,
            height: imageHeight * (width / imageWidth),
          });
        } else if (!width && height) {
          this.setState({
            width: imageWidth * (height / imageHeight),
            height,
          });
        } else {
          this.setState({
            width: imageWidth,
            height: imageHeight,
          });
        }
      });
    }
  }

  mounted = false

  render() {
    const { uri, borderRadius } = this.props;
    const { width, height } = this.state;

    return (
      <FastImage
        resizeMode="cover"
        source={{ uri }}
        style={{ width, height, borderRadius, overflow: 'hidden' }}
        borderRadius={borderRadius}
      />
    );
  }
}

export const PostImageSeparator = () => <View style={styles.separator} />;
