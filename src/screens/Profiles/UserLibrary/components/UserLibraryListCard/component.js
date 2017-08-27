import * as React from 'react';
import { debounce } from 'lodash';
import { PropTypes } from 'prop-types';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import { Counter } from 'kitsu/components/Counter';
import { ProgressBar } from 'kitsu/components/ProgressBar';
import { Rating } from 'kitsu/components/Rating';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import Swipeable from 'react-native-swipeable';
import { styles } from './styles';

const menuImage = require('kitsu/assets/img/menus/three-dot-horizontal-grey.png');

const STATUS_SELECT_OPTIONS = [
  { value: 'current', anime: 'Currently Watching', manga: 'Currently Reading' },
  { value: 'planned', anime: 'Want To Watch', manga: 'Want To Read' },
  { value: 'onHold', anime: 'On Hold', manga: 'On Hold' },
  { value: 'dropped', anime: 'Dropped', manga: 'Dropped' },
  { value: 'completed', anime: 'Completed', manga: 'Completed' },
  { value: 'remove', anime: 'Remove From Library', manga: 'Remove From Library' },
  { value: 'cancel', anime: 'Nevermind', manga: 'Nevermind' },
];

export class UserLibraryListCard extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    libraryStatus: PropTypes.string.isRequired,
    libraryType: PropTypes.string.isRequired,
    profile: PropTypes.object.isRequired,
    updateUserLibraryEntry: PropTypes.func.isRequired,
  }

  state = {
    isUpdating: false,
    libraryStatus: this.props.data.status,
    progress: this.props.data.progress,
    progressPercentage: Math.floor((this.props.data.progress / this.getMaxProgress()) * 100),
    ratingTwenty: this.props.data.ratingTwenty,
    sliderCanActivate: false,
  }

  onProgressValueChanged = (newProgress) => {
    const maxProgress = this.getMaxProgress();
    const progressPercentage = Math.floor((newProgress / maxProgress) * 100);
    this.setState({
      progressPercentage,
      progress: newProgress,
    }, this.debounceSave);
  }

  onRatingChanged = (ratingTwenty) => {
    this.setState({ ratingTwenty }, this.debounceSave);
  }

  onRightButtonsActivate = () => {
    this.setState({ sliderCanActivate: true });
  }

  onRightButtonsDeactivate = () => {
    this.setState({ sliderCanActivate: false });
  }

  onStatusSelected = (libraryStatus) => {
    this.setState({ libraryStatus }, this.debounceSave);
  }

  getMaxProgress() {
    const { data, libraryType } = this.props;
    const mediaData = data[libraryType];

    if (mediaData.type === 'anime') {
      return mediaData.episodeCount;
    }

    return mediaData.chapterCount;
  }

  saveEntry = async () => {
    // send the status from props because that is the list we're looking
    // at not the status from state because that is what the value of the
    // card may have just been changed to
    const { libraryStatus, libraryType } = this.props;
    const { libraryStatus: newStatus, progress, ratingTwenty } = this.state;

    await this.props.updateUserLibraryEntry(libraryType, libraryStatus, {
      id: this.props.data.id,
      progress,
      ratingTwenty,
      status: newStatus,
    });
  }

  debounceSave = debounce(this.saveEntry, 200);

  selectOptions = STATUS_SELECT_OPTIONS.map(option => ({
    value: option.value,
    text: option[this.props.libraryType],
  })).filter(option => option.value !== this.props.libraryStatus);

  render() {
    const { data, libraryType, currentUser } = this.props;
    const { progressPercentage, sliderCanActivate } = this.state;
    const mediaData = data[libraryType];
    const canEdit = this.props.profile.id === this.props.currentUser.id;
    const maxProgress = this.getMaxProgress();

    return (
      <Swipeable
        onRightButtonsActivate={this.onRightButtonsActivate}
        onRightButtonsDeactivate={this.onRightButtonsDeactivate}
        rightButtonsActivationDistance={145}
        rightButtonWidth={145}
        rightButtons={[
          <TouchableHighlight
            style={[
              styles.swipeButton,
              (sliderCanActivate ? styles.swipeButtonActive : styles.swipeButtonInactive),
            ]}
          >
            <Text style={styles.swipeButtonText}>{canEdit ? 'Edit Entry' : 'View Details'}</Text>
          </TouchableHighlight>,
        ]}
      >
        <View style={styles.container}>
          <Image style={styles.posterImage} source={{ uri: mediaData.posterImage.small }} />

          <View style={styles.content}>
            <View style={styles.titleSection}>
              <Text style={styles.titleText}>{mediaData.canonicalTitle}</Text>
              {canEdit && (
                <SelectMenu
                  options={this.selectOptions}
                  onOptionSelected={this.onStatusSelected}
                >
                  <Image
                    source={menuImage}
                    style={styles.menuButton}
                    resizeMode="contain"
                  />
                </SelectMenu>
              )}
            </View>
            <View style={styles.progressContainer}>
              <ProgressBar
                height={6}
                fillPercentage={progressPercentage}
                backgroundStyle={styles.progressBarBackgroun}
              />
            </View>
            <View style={styles.statusSection}>
              <Counter
                disabled={!canEdit}
                initialValue={data.progress}
                maxValue={maxProgress}
                progressCounter
                onValueChanged={this.onProgressValueChanged}
              />
              <Rating
                disabled={!canEdit}
                size="small"
                viewType="single"
                onRatingChanged={this.onRatingChanged}
                style={styles.ratingStyle}
                rating={data.ratingTwenty}
                ratingSystem={currentUser.ratingSystem}
              />
            </View>
          </View>
        </View>
      </Swipeable>
    );
  }
}
