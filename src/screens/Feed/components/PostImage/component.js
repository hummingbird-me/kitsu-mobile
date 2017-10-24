import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import { styles } from './styles';

export class PostImage extends Component {
  constructor(props) {
    super(props);
    this.state = { source: { uri: this.props.uri } };
  }

  componentWillMount() {
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
    return (
      <Image
        resizeMode="cover"
        source={this.state.source}
        style={{
          height: this.state.height,
          width: this.state.width,
        }}
      />
    );
  }
}


PostImage.propTypes = {
  uri: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

PostImage.defaultProps = {
  size: 'default',
  width: 0,
  height: 0,
};

export const PostImageSeparator = () => <View style={styles.separator} />;
