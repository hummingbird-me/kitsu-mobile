import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import * as colors from '../../constants/colors';

export default class Thumbnail extends Component {
  static propTypes = {
    size: PropTypes.number,
    image: PropTypes.string.isRequired,
    selectedIndex: PropTypes.number.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  static defaultProps = {
    size: 50,
  }

  onPress = () => {
    this.props.onToggle(this.props.image);
  }

  render() {
    const { image, selectedIndex, size } = this.props;

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={styles.wrapper}
      >
        <Image
          source={{ uri: image }}
          style={{
            width: size - styles.wrapper.margin * 2,
            height: size - styles.wrapper.margin * 2,
          }}
        >
          {selectedIndex >= 0 && <View style={styles.selectionRectangle} />}
          {selectedIndex >= 0 && <Text style={styles.selectionNumber}>{selectedIndex + 1}</Text>}
        </Image>
      </TouchableOpacity>
    );
  }
}

const styles = {
  wrapper: {
    margin: 2,
  },
  selectionRectangle: {
    flex: 1,
    borderWidth: 4,
    borderColor: colors.lightGreen,
  },
  selectionNumber: {
    position: 'absolute',
    top: 2, // To ensure the centering is done from the edge of the selection rectangle.
    right: 2,
    width: 25,
    height: 25,

    backgroundColor: colors.lightGreen,
    color: colors.white,

    textAlign: 'center',
    fontFamily: 'OpenSans',
    fontSize: 16,
    fontWeight: '700',
  }
}
