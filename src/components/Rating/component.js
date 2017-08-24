import React, { PureComponent } from 'react';
import { Image, Modal, Slider, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

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

function displayRatingFromTwenty(ratingTwenty, type) {
  if (type === 'regular') {
    return Math.round(ratingTwenty / 2) / 2;
  } else if (type === 'advanced') {
    return ratingTwenty / 2;
  } else if (type === 'simple') {
    return ratingTwenty;
  }

  throw new Error(`Unknown rating type ${type}.`);
}

function getRatingTwentyProperties(ratingTwenty, type) {
  const ratingProperties = {};
  const rating = displayRatingFromTwenty(ratingTwenty, type);

  switch (type) {
    case 'advanced':
      ratingProperties.text = rating >= 10 ? rating : rating.toFixed(1);
      ratingProperties.textStyle = styles.textStar;
      break;
    case 'regular':
      ratingProperties.text = rating >= 5 ? rating : rating.toFixed(1);
      ratingProperties.textStyle = styles.textStar;
      break;
    case 'simple':
    default:
      if (rating < 6) {
        ratingProperties.text = 'AWFUL';
        ratingProperties.textStyle = styles.textAwful;
      } else if (rating < 10) {
        ratingProperties.text = 'MEH';
        ratingProperties.textStyle = styles.textMeh;
      } else if (rating < 16) {
        ratingProperties.text = 'GOOD';
        ratingProperties.textStyle = styles.textGood;
      } else {
        ratingProperties.text = 'GREAT';
        ratingProperties.textStyle = styles.textGreat;
      }
      break;
  }

  return ratingProperties;
}

function getRatingTwentyForText(text, type) {
  if (type !== 'simple') {
    throw new Error('This function should only be used in simple ratings.');
  }

  switch (text) {
    case 'awful':
      return 2;
    case 'meh':
      return 8;
    case 'good':
      return 14;
    case 'great':
      return 20;
    default:
      throw new Error(`Unknown text while determining simple rating type: "${text}"`);
  }
}

export class Rating extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onRatingChanged: PropTypes.func,
    rating: PropTypes.number,
    ratingSystem: PropTypes.oneOf(['simple', 'regular', 'advanced']),
    showNotRated: PropTypes.bool,
    size: PropTypes.string,
    style: PropTypes.any,
    viewType: PropTypes.oneOf(['single', 'select']),
  }

  static defaultProps = {
    disabled: false,
    onRatingChanged: () => { },
    rating: null,
    ratingSystem: 'simple',
    showNotRated: true,
    size: 'normal',
    style: null,
    viewType: 'select',
  }

  constructor(props) {
    super(props);

    this.state.ratingTwenty = props.rating;
  }

  state = {
    inlineFacesVisible: false,
    modalVisible: false,
    ratingTwenty: 20,
  }

  onModalClosed = () => {
    this.cancel();
  }

  toggleModal = (selectedButton) => {
    const { ratingSystem, viewType } = this.props;

    // If there's a specific simple system rating we can action, just do that, otherwise
    // go down to the two modals.
    if (selectedButton) {
      const ratingTwenty = getRatingTwentyForText(selectedButton, ratingSystem);
      this.setState({
        modalVisible: false,
        ratingTwenty,
      });
    } else {
      // All other modes get the modal, which should render itself correctly
      // based on our ratingSystem prop.
      this.setState({ modalVisible: !this.state.modalVisible });
    }
  }

  confirm = () => {
    this.toggleModal();

    this.props.onRatingChanged(this.state.ratingTwenty);
  }

  cancel = () => {
    this.toggleModal();

    // Reset the rating.
    this.setState({ ratingTwenty: this.props.rating });
  }

  sliderValueChanged = (ratingTwenty, ratingSystem) => {
    // We use the 0 or 1 rating to indicate 'no rating',
    // but we don't want to deal with that in our actual state.
    if ((ratingSystem !== 'advanced' && ratingTwenty >= 1) ||
        (ratingSystem === 'advanced' && ratingTwenty >= 1.5)) {
      this.setState({ ratingTwenty });
    } else {
      this.setState({ ratingTwenty: null });
    }
  }

  styleForRatingTwenty(ratingTwenty, image) {
    const { ratingSystem, showNotRated, size, viewType } = this.props;

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

    if (viewType === 'single' || ratingSystem !== 'simple') {
      defaultStyle.push({ display: 'none' });
    }

    selectedStyle = StyleSheet.flatten(selectedStyle);
    defaultStyle = StyleSheet.flatten(defaultStyle);

    if (ratingTwenty === null) {
      if (ratingSystem !== 'simple') {
        return image === 'no-rating-star' && showNotRated ? selectedStyle : defaultStyle;
      }

      return image === 'no-rating' && showNotRated ? selectedStyle : defaultStyle;
    } else if (image === 'no-rating' || image === 'no-rating-star') {
      return { display: 'none' };
    }

    if (ratingSystem === 'regular' || ratingSystem === 'advanced') {
      return image === 'star' ? selectedStyle : defaultStyle;
    } else if (image === 'star') {
      return { display: 'none' };
    }

    if (ratingTwenty < 3) {
      return image === 'awful' ? selectedStyle : defaultStyle;
    } else if (ratingTwenty < 9) {
      return image === 'meh' ? selectedStyle : defaultStyle;
    } else if (ratingTwenty < 15) {
      return image === 'good' ? selectedStyle : defaultStyle;
    }

    return image === 'great' ? selectedStyle : defaultStyle;
  }

  textForRatingTwenty(ratingTwenty) {
    const { ratingSystem, size, viewType } = this.props;
    if (viewType !== 'single') {
      return null;
    }

    let fontSize;
    switch (size) {
      case 'tiny': fontSize = TextSize.Tiny; break;
      case 'small': fontSize = TextSize.Small; break;
      case 'normal': default: fontSize = TextSize.Normal; break;
    }

    if (ratingTwenty === null) {
      return this.props.showNotRated
        ? <Text style={[styles.textNotRated, { fontSize }]}>Not Rated</Text>
        : null;
    }

    const { text, textStyle } = getRatingTwentyProperties(ratingTwenty, ratingSystem);
    return <Text style={[textStyle, { fontSize }]}>{text}</Text>;
  }

  render() {
    const { ratingSystem } = this.props;
    const { ratingTwenty } = this.state;

    return (
      <View {...this.props} style={[styles.wrapper, this.props.style]}>
        <TouchableOpacity
          onPress={() => this.toggleModal()}
          disabled={this.props.disabled}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('kitsu/assets/img/ratings/no-rating.png')} style={this.styleForRatingTwenty(ratingTwenty, 'no-rating')} />
            <Image source={require('kitsu/assets/img/ratings/no-rating-star.png')} style={this.styleForRatingTwenty(ratingTwenty, 'no-rating-star')} />

            <TouchableOpacity
              onPress={() => this.toggleModal('awful')}
              disabled={this.props.disabled}
            >
              <Image source={require('kitsu/assets/img/ratings/awful.png')} style={this.styleForRatingTwenty(ratingTwenty, 'awful')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleModal('meh')}
              disabled={this.props.disabled}
            >
              <Image source={require('kitsu/assets/img/ratings/meh.png')} style={this.styleForRatingTwenty(ratingTwenty, 'meh')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleModal('good')}
              disabled={this.props.disabled}
            >
              <Image source={require('kitsu/assets/img/ratings/good.png')} style={this.styleForRatingTwenty(ratingTwenty, 'good')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleModal('great')}
              disabled={this.props.disabled}
            >
              <Image source={require('kitsu/assets/img/ratings/great.png')} style={this.styleForRatingTwenty(ratingTwenty, 'great')} />
            </TouchableOpacity>

            <Image source={require('kitsu/assets/img/ratings/star.png')} style={this.styleForRatingTwenty(ratingTwenty, 'star')} />
            {this.textForRatingTwenty(ratingTwenty)}
          </View>
        </TouchableOpacity>

        {ratingSystem !== 'simple'
          && <Modal
            animationType="slide"
            visible={this.state.modalVisible}
            onRequestClose={this.onModalClosed}
            transparent
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                {/* Cancel, Slide / Tap to Rate, Done */}
                <TouchableOpacity onPress={this.cancel}>
                  <Text style={[styles.modalHeaderText, styles.modalCancelButton]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalHeaderText}>
                  {ratingSystem === 'simple' ? 'Tap' : 'Slide'} to Rate</Text>
                <TouchableOpacity onPress={this.confirm}>
                  <Text style={[styles.modalHeaderText, styles.modalDoneButton]}>Done</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                { /* Star, 4.5 */
                  ratingTwenty ?
                    <View style={styles.modalStarRow}>
                      <Icon name="star" size={65} color={colors.yellow} />
                      <Text style={styles.modalRatingText}>
                        {getRatingTwentyProperties(ratingTwenty, ratingSystem).text}
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
                  minimumValue={ratingSystem === 'regular' ? 0 : 1}
                  maximumValue={20}
                  step={ratingSystem === 'regular' ? 2 : 1}
                  value={ratingTwenty}
                  minimumTrackTintColor={colors.tabRed}
                  maximumTrackTintColor={'rgb(43, 33, 32)'}
                  onValueChange={this.sliderValueChanged}
                  style={styles.modalSlider}
                />
              </View>
            </View>
          </Modal>
        }
      </View>
    );
  }
}
