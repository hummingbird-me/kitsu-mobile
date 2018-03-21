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
    Image.getSize(this.props.uri, (width, height) => {
      if (!this.mounted) return;

      if (this.props.width && !this.props.height) {
        this.setState({
          width: this.props.width,
          height: height * (this.props.width / width),
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
