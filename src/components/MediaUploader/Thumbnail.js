import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as colors from 'kitsu/constants/colors';

export default class Thumbnail extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    image: PropTypes.object.isRequired,
    type: PropTypes.string,
    placeholder: PropTypes.bool,
    playableDuration: PropTypes.string,
    selectedIndex: PropTypes.number.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  static defaultProps = {
    playableDuration: null,
    placeholder: false,
    size: 50,
    type: 'ALAssetTypePhoto',
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
    const { placeholder, image, selectedIndex, size, type } = this.props;
    let source = { uri: image.uri };

    // Our placeholders sometimes come through with numbers as sources.
    if (typeof image.uri !== 'string') {
      source = null;
    }

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={styles.wrapper}
        disabled={placeholder}
      >
        <Image
          source={source}
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
    backgroundColor: colors.darkGrey,
  },
  selectionRectangle: {
    flex: 1,
    borderWidth: 4,
    borderColor: colors.green,
  },
  selectionNumber: {
    position: 'absolute',
    top: 2, // To ensure the centering is done from the edge of the selection rectangle.
    right: 2,
    width: 25,
    height: 25,

    backgroundColor: colors.green,
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
