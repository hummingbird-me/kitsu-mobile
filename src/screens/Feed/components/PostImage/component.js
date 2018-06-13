import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { isDataUrl } from 'kitsu/common/utils/url';
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
    size: 'default',
    width: null,
    height: null,
    borderRadius: 0,
    maxAutoHeight: 400,
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
    /*
    If we do: const { width, height, uri } = this.props
    Then the view updates incorrectly, i.e nextProps.width won't be applied to the state
    Thus i have chosen to leave the implementation as is, but i don't know if there is a work-around
    */
    if (this.props.width && this.props.height) {
      this.setState({
        width: this.props.width,
        height: this.props.height,
      });
    } else {
      Image.getSize(this.props.uri, (width, height) => {
        if (!this.mounted) return;

        if (this.props.width && !this.props.height) {
          this.setState({
            width: this.props.width,
            height: Math.min(this.props.maxAutoHeight, height * (this.props.width / width)),
          });
        } else if (!this.props.width && this.props.height) {
          this.setState({
            width: width * (this.props.height / height),
            height: this.props.height,
          });
        } else {
          this.setState({
            width,
            height,
          });
        }
      });
    }
  }

  mounted = false

  render() {
    const { uri, borderRadius } = this.props;
    const { width, height } = this.state;

    /*
    Data url images don't work on android with FastImage.
    Thus we have to fallback to a regular image component.

    Same thing is done in `ImageLightbox`

    Relevant PRs:
      - https://github.com/DylanVann/react-native-fast-image/pull/91
      - https://github.com/DylanVann/react-native-fast-image/pull/205
    */
    const ImageComponent = (isDataUrl(uri) && Platform.OS === 'android') ? Image : FastImage;

    return (
      <ImageComponent
        resizeMode="cover"
        source={{ uri }}
        style={{ width, height, borderRadius, overflow: 'hidden' }}
      />
    );
  }
}

export const PostImageSeparator = () => <View style={styles.separator} />;
