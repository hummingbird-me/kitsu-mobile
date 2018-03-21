import React, { PureComponent } from 'react';
import { Modal, Slider, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as colors from 'kitsu/constants/colors';
import awfulImage from 'kitsu/assets/img/ratings/awful.png';
import goodImage from 'kitsu/assets/img/ratings/good.png';
import greatImage from 'kitsu/assets/img/ratings/great.png';
import mehImage from 'kitsu/assets/img/ratings/meh.png';
import noRatingImage from 'kitsu/assets/img/ratings/no-rating.png';
import noRatingStarImage from 'kitsu/assets/img/ratings/no-rating-star.png';
import starImage from 'kitsu/assets/img/ratings/star.png';
import { styles } from './styles';

const TextSize = {
  Tiny: 10,
  Small: 12,
  Normal: 18,
};

const ImageSize = {
  Tiny: 10,
  Small: 20,
  Normal: 30,
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
    case 'no-rating':
      return null;
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
    onRatingModalDisplay: PropTypes.func,
    ratingTwenty: PropTypes.number,
    ratingSystem: PropTypes.oneOf(['simple', 'regular', 'advanced']),
    showNotRated: PropTypes.bool,
    size: PropTypes.string,
    style: PropTypes.any,
    viewType: PropTypes.oneOf(['single', 'select']),
  }

  static defaultProps = {
    disabled: false,
    onRatingChanged: () => { },
    onRatingModalDisplay: () => { },
    ratingTwenty: null,
    ratingSystem: 'simple',
    showNotRated: true,
    size: 'normal',
    style: null,
    viewType: 'select',
  }

  state = {
    inlineFacesVisible: false,
    modalVisible: false,
    ratingTwenty: this.props.ratingTwenty,
  }

  componentWillReceiveProps({ ratingTwenty }) {
    if (ratingTwenty !== this.state.ratingTwenty) {
      this.setState({ ratingTwenty });
    }
  }

  onModalClosed = () => {
    this.cancel();
  }

  setSimpleRating = (ratingTwenty) => {
    this.setState({ ratingTwenty });
  }

  toggleModal = (selectedButton) => {
    const { ratingSystem, onRatingModalDisplay, onRatingChanged } = this.props;

    // If there's a specific simple system rating we can action, just do that, otherwise
    // go down to the two modals.
    if (selectedButton) {
      const ratingTwenty = getRatingTwentyForText(selectedButton, ratingSystem);
      this.setState({
        modalVisible: false,
        ratingTwenty,
      });
      onRatingModalDisplay(false);
      onRatingChanged(ratingTwenty === 0 ? null : ratingTwenty);
    } else {
      // All other modes get the modal, which should render itself correctly
      // based on our ratingSystem prop.
      this.setState({ modalVisible: !this.state.modalVisible });
      onRatingModalDisplay(!this.state.modalVisible);
    }
  }

  confirm = () => {
    const { ratingTwenty } = this.state;

    this.toggleModal();
    this.props.onRatingChanged(ratingTwenty === 0 ? null : ratingTwenty);
  }

  cancel = () => {
    this.toggleModal();

    // Reset the rating.
    this.setState({ ratingTwenty: this.props.ratingTwenty });
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
    const displayNone = { display: 'none' };
    const { ratingSystem, showNotRated, size, viewType } = this.props;

    let defaultStyle = [styles.default];
    let selectedStyle = [styles.selected];

    // if the rating system is star and the iamge isn't a star, don't show it
    // and also vise versa.
    if (ratingSystem === 'simple' && image.includes('star')) {
      return [...defaultStyle, displayNone];
    } else if (ratingSystem !== 'simple' && !image.includes('star')) {
      return [...defaultStyle, displayNone];
    }

    // next, style the image for the size of the rating component
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

    // for a single view type -- we only show the selected rating, so the default will be hidden
    if (viewType === 'single' || ratingSystem !== 'simple') {
      defaultStyle.push(displayNone);
    }

    selectedStyle = StyleSheet.flatten(selectedStyle);
    defaultStyle = StyleSheet.flatten(defaultStyle);

    // handle no rating
    if (ratingTwenty === null) {
      if (!showNotRated) {
        return StyleSheet.flatten([displayNone]);
      }

      return image.includes('no-rating') ? selectedStyle : defaultStyle;
    }

    // handle non-simple ratings
    if (ratingSystem !== 'simple' && image.includes('star') && !image.includes('no-rating')) {
      return selectedStyle;
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
    if (ratingSystem === 'simple' && viewType !== 'single') {
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
    const { ratingSystem, viewType } = this.props;
    const { ratingTwenty } = this.state;

    const isSelectView = viewType === 'select';

    return (
      <View {...this.props} style={[styles.wrapper, this.props.style]}>
        <TouchableOpacity
          onPress={() => this.toggleModal()}
          disabled={this.props.disabled}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FastImage source={noRatingStarImage} style={this.styleForRatingTwenty(ratingTwenty, 'no-rating-star')} />
            <FastImage source={starImage} style={this.styleForRatingTwenty(ratingTwenty, 'star')} />

            <TouchableOpacity
              onPress={() => this.toggleModal(isSelectView && 'no-rating')}
              disabled={this.props.disabled}
            >
              <FastImage source={noRatingImage} style={this.styleForRatingTwenty(ratingTwenty, 'no-rating')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleModal(isSelectView && 'awful')}
              disabled={this.props.disabled}
            >
              <FastImage source={awfulImage} style={this.styleForRatingTwenty(ratingTwenty, 'awful')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleModal(isSelectView && 'meh')}
              disabled={this.props.disabled}
            >
              <FastImage source={mehImage} style={this.styleForRatingTwenty(ratingTwenty, 'meh')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleModal(isSelectView && 'good')}
              disabled={this.props.disabled}
            >
              <FastImage source={goodImage} style={this.styleForRatingTwenty(ratingTwenty, 'good')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleModal(isSelectView && 'great')}
              disabled={this.props.disabled}
            >
              <FastImage source={greatImage} style={this.styleForRatingTwenty(ratingTwenty, 'great')} />
            </TouchableOpacity>

            {this.textForRatingTwenty(ratingTwenty)}
          </View>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={this.onModalClosed}
          transparent
        >
          <View style={ratingSystem === 'simple' ? styles.modalContentSimple : styles.modalContent}>
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

            {ratingSystem === 'simple' &&
              <View style={styles.modalBodySimple} >
                <Rating
                  ratingTwenty={this.state.ratingTwenty}
                  onRatingChanged={this.setSimpleRating}
                  viewType="select"
                />
              </View>
            }

            {ratingSystem !== 'simple' &&
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
                minimumValue={0}
                maximumValue={20}
                step={ratingSystem === 'regular' ? 2 : 1}
                value={ratingTwenty}
                minimumTrackTintColor={colors.tabRed}
                maximumTrackTintColor={'rgb(43, 33, 32)'}
                onValueChange={this.sliderValueChanged}
                style={styles.modalSlider}
              />
            </View>
            }
          </View>
        </Modal>
      </View>
    );
  }
}
