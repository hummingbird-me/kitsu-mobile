import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as colors from '../../constants/colors';

export default class Thumbnail extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    image: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    playableDuration: PropTypes.string,
    selectedIndex: PropTypes.number.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  static defaultProps = {
    playableDuration: null,
    size: 50,
  }

  onPress = () => {
    this.props.onToggle(this.props.image);
  }

  renderTypeIndicator(type) {
    if (type === 'ALAssetTypeVideo') {
      return (
        <View style={styles.videoIndicatorWrapper}>
          <Icon name="video-camera" style={styles.typeIcon} />
          <Text style={styles.durationText}>{this.props.playableDuration}</Text>
        </View>
      );
    }

    return null;
  }

  render() {
    const { image, selectedIndex, size, type } = this.props;

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={styles.wrapper}
      >
        <Image
          source={{ uri: image }}
          style={{
            width: size - (styles.wrapper.margin * 2),
            height: size - (styles.wrapper.margin * 2),
          }}
        >
          {this.renderTypeIndicator(type)}
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
  },
  videoIndicatorWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    height: 25,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  typeIcon: {
    color: colors.white,
    fontSize: 14,
    margin: 5,
  },
  durationText: {
    flex: 1,
    color: colors.white,
    fontFamily: 'OpenSans',
    fontSize: 11,
    textAlign: 'right',
    margin: 4,
    marginRight: 6,
  },
};
