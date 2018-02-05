import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import { styles } from './styles';

export class PostImage extends PureComponent {
  static propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    borderRadius: PropTypes.number,
    overlayColor: PropTypes.string,
  };

  static defaultProps = {
    size: 'default',
    width: null,
    height: null,
  };

  state = {
    width: 0,
    height: 0,
    borderRadius: 0,
    overlayColor: null,
  }

  componentWillMount() {
    this.mounted = true;

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

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted = false

  render() {
    const { uri, borderRadius, overlayColor } = this.props;
    const { width, height } = this.state;

    return (
      <Image
        resizeMode="cover"
        source={{ uri }}
        style={{ width, height, borderRadius, overlayColor }}
      />
    );
  }
}

export const PostImageSeparator = () => <View style={styles.separator} />;
