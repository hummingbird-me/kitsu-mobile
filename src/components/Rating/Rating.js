import React, { PureComponent } from 'react';
import { Image, Modal, Slider, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as colors from 'kitsu/constants/colors';

const TextSize = {
  Tiny: 10,
  Small: 12,
  Normal: 18,
};

const ImageSize = {
  Tiny: 10,
  Small: 20,
  Normal: 50,
};

export default class Rating extends PureComponent {
  static propTypes = {
    onRatingChanged: PropTypes.func,
    rating: PropTypes.number,
    showNotRated: PropTypes.bool,
    size: PropTypes.string,
    viewType: PropTypes.string,
  }

  static defaultProps = {
    onRatingChanged: () => { },
    rating: null,
    showNotRated: true,
    size: 'normal',
    viewType: 'select',
  }

  constructor(props) {
    super(props);

    this.state.rating = props.rating;
  }

  state = {
    modalVisible: false,
    rating: 10,
  }

  onModalClosed = () => {
    this.cancel();
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  confirm = () => {
    this.toggleModal();

    this.props.onRatingChanged(this.state.rating);
  }

  cancel = () => {
    this.toggleModal();

    // Reset the rating.
    this.setState({ rating: this.props.rating });
  }

  sliderValueChanged = (rating) => {
    // We use the 0.5 rating to indicate 'no rating',
    // but we don't want to deal with that in our actual state.
    if (rating >= 1) {
      this.setState({ rating });
    } else {
      this.setState({ rating: null });
    }
  }

  styleForRating(rating, image) {
    const { size, viewType } = this.props;

    let defaultStyle = [styles.default];
    let selectedStyle = [styles.selected];

    switch (size) {
      case 'tiny':
        defaultStyle.push({ width: ImageSize.Tiny, height: ImageSize.Tiny });
        selectedStyle.push({ width: ImageSize.Tiny, height: ImageSize.Tiny });
        break;
      case 'small':
        defaultStyle.push({ width: ImageSize.Small, height: ImageSize.Small });
        selectedStyle.push({ width: ImageSize.Small, height: ImageSize.Small });
        break;
      case 'normal':
      default:
        defaultStyle.push({ width: ImageSize.Normal, height: ImageSize.Normal });
        selectedStyle.push({ width: ImageSize.Normal, height: ImageSize.Normal });
        break;
    }

    if (viewType === 'single') {
      defaultStyle.push({ display: 'none' });
    }

    selectedStyle = StyleSheet.flatten(selectedStyle);
    defaultStyle = StyleSheet.flatten(defaultStyle);

    if (rating === null) {
      return defaultStyle;
    }

    if (rating < 3) {
      return image === 'awful' ? selectedStyle : defaultStyle;
    } else if (rating < 5) {
      return image === 'meh' ? selectedStyle : defaultStyle;
    } else if (rating < 8) {
      return image === 'good' ? selectedStyle : defaultStyle;
    }

    return image === 'great' ? selectedStyle : defaultStyle;
  }

  textForRating(rating) {
    const { size } = this.props;
    let fontSize;
    switch (size) {
      case 'tiny': fontSize = TextSize.Tiny; break;
      case 'small': fontSize = TextSize.Small; break;
      case 'normal': default: fontSize = TextSize.Normal; break;
    }

    if (rating === null) {
      return this.props.showNotRated ? <Text style={[styles.textNotRated, { fontSize }]}>Not Rated</Text> : null;
    }

    if (rating < 3) {
      return <Text style={[styles.textAwful, { fontSize }]}>AWFUL</Text>;
    } else if (rating < 5) {
      return <Text style={[styles.textMeh, { fontSize }]}>MEH</Text>;
    } else if (rating < 8) {
      return <Text style={[styles.textGood, { fontSize }]}>GOOD</Text>;
    }

    return <Text style={[styles.textGreat, { fontSize }]}>GREAT</Text>;
  }

  render() {
    const { rating } = this.state;

    return (
      <View {...this.props}>
        <TouchableOpacity onPress={this.toggleModal} style={styles.wrapper} disabled={this.props.disabled}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('kitsu/assets/img/ratings/awful.png')} style={this.styleForRating(rating, 'awful')} />
            <Image source={require('kitsu/assets/img/ratings/meh.png')} style={this.styleForRating(rating, 'meh')} />
            <Image source={require('kitsu/assets/img/ratings/good.png')} style={this.styleForRating(rating, 'good')} />
            <Image source={require('kitsu/assets/img/ratings/great.png')} style={this.styleForRating(rating, 'great')} />
            {this.textForRating(rating)}
          </View>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={this.onModalClosed}
          transparent
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              {/* Cancel, Slide to Rate, Done */}
              <TouchableOpacity onPress={this.cancel}>
                <Text style={[styles.modalHeaderText, styles.modalCancelButton]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalHeaderText}>Slide to Rate</Text>
              <TouchableOpacity onPress={this.confirm}>
                <Text style={[styles.modalHeaderText, styles.modalDoneButton]}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {/* Star, 4.5 */}
              { rating ?
                <View style={styles.modalStarRow}>
                  <Icon name="star" size={65} color={colors.activeYellow} />
                  <Text style={styles.modalRatingText}>
                    {rating >= 10 ? rating : rating.toFixed(1)}
                  </Text>
                </View>
                :
                <View style={styles.modalStarRow}>
                  <Text style={styles.modalNoRatingText}>
                    No Rating
                  </Text>
                </View>
              }
              {/* Slider */}
              <Slider
                minimumValue={0.5}
                maximumValue={10}
                step={0.5}
                value={this.state.rating}
                minimumTrackTintColor={colors.tabRed}
                maximumTrackTintColor={'rgb(43, 33, 32)'}
                onValueChange={this.sliderValueChanged}
                style={styles.modalSlider}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  hide: {
    display: 'none',
  },
  wrapper: {
    flexDirection: 'row',
  },
  selected: {
    margin: 3,
  },
  default: {
    margin: 3,
    opacity: 0.4,
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 250,
  },
  modalHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxHeight: 46,
    minHeight: 46,
    backgroundColor: colors.listBackPurple,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(46, 34, 45)',
  },
  modalHeaderText: {
    color: colors.white,
    fontWeight: '700',
    fontFamily: 'OpenSans',
    fontSize: 18,
    margin: 10,
  },
  modalCancelButton: {
    color: colors.lightGrey,
  },
  modalDoneButton: {
    color: colors.activeYellow,
  },
  modalBody: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: colors.listBackPurple,
  },
  modalStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '32%',
  },
  modalRatingText: {
    color: 'rgb(255, 218, 168)',
    fontSize: 60,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    marginLeft: 12,
  },
  modalNoRatingText: {
    color: colors.lightGrey,
    fontSize: 30,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    lineHeight: 82,
  },
  modalSlider: {
    marginHorizontal: 30,
  },
  textNotRated: {
    color: colors.darkGrey,
    fontWeight: '700',
  },
  textAwful: {
    color: colors.red,
    fontWeight: '700',
  },
  textMeh: {
    color: colors.orange,
    fontWeight: '700',
  },
  textGood: {
    color: colors.green,
    fontWeight: '700',
  },
  textGreat: {
    color: colors.blue,
    fontWeight: '700',
  },
});
