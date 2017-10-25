import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import { styles } from './styles';

export class PostImage extends PureComponent {
  static propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    size: 'default',
    width: null,
    height: null,
  };

  state = {
    width: 0,
    height: 0,
  }

  componentDidMount() {
    Image.getSize(this.props.uri, (width, height) => {
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

  render() {
    const { uri } = this.props;
    const { width, height } = this.state;

    return (
      <Image
        resizeMode="cover"
        source={{ uri }}
        style={{ width, height }}
      />
    );
  }
}

export const PostImageSeparator = () => <View style={styles.separator} />;
