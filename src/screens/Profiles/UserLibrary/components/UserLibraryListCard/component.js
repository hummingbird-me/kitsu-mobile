import * as React from 'react';
import debounce from 'lodash/debounce';
import { PropTypes } from 'prop-types';
import { Image, Text, View } from 'react-native';
import { Counter } from 'kitsu/components/Counter';
import { ProgressBar } from 'kitsu/components/ProgressBar';
import { Rating } from 'kitsu/components/Rating';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { MediaCard } from 'kitsu/components/MediaCard';
import Swipeable from 'react-native-swipeable';
import menuImage from 'kitsu/assets/img/menus/three-dot-horizontal-grey.png';
import { styles } from './styles';

const USER_LIBRARY_EDIT_SCREEN = 'UserLibraryEdit';

export const STATUS_SELECT_OPTIONS = [
  { value: 'current', anime: 'Currently Watching', manga: 'Currently Reading' },
  { value: 'planned', anime: 'Want To Watch', manga: 'Want To Read' },
  { value: 'on_hold', anime: 'On Hold', manga: 'On Hold' },
  { value: 'dropped', anime: 'Dropped', manga: 'Dropped' },
  { value: 'completed', anime: 'Completed', manga: 'Completed' },
  { value: 'remove', anime: 'Remove From Library', manga: 'Remove From Library' },
  { value: 'cancel', anime: 'Nevermind', manga: 'Nevermind' },
];

const HEADER_TEXT_MAPPING = {
  current: { anime: 'Watching', manga: 'Reading' },
  planned: { anime: 'Want To Watch', manga: 'Want to Read' },
  completed: { anime: 'Complete', manga: 'Complete' },
  on_hold: { anime: 'On Hold', manga: 'On Hold' },
  dropped: { anime: 'Dropped', manga: 'Dropped' },
};

export class UserLibraryListCard extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    libraryEntry: PropTypes.object.isRequired,
    libraryStatus: PropTypes.string.isRequired,
    libraryType: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
    onSwipingItem: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    updateUserLibraryEntry: PropTypes.func.isRequired,
  }

  state = {
    isUpdating: false,
    libraryStatus: this.props.libraryEntry.status,
    progress: this.props.libraryEntry.progress,
    progressPercentage: Math.floor(
      (this.props.libraryEntry.progress / this.getMaxProgress()) * 100,
    ),
    ratingTwenty: this.props.libraryEntry.ratingTwenty,
    isSliderActive: false,
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

  onRightActionActivate = () => {
    this.setState({ isSliderActive: true });
  }

  onRightActionDeactivate = () => {
    this.setState({ isSliderActive: false });
  }

  onStatusSelected = (libraryStatus) => {
    this.setState({ libraryStatus }, this.debounceSave);
  }

  onSwipeStart = () => this.props.onSwipingItem(true)

  onSwipeRelease = () => this.props.onSwipingItem(false)

  getMaxProgress() {
    const { libraryEntry, libraryType } = this.props;
    const mediaData = libraryEntry[libraryType];

    if (mediaData.type === 'anime') {
      return mediaData.episodeCount;
    }

    return mediaData.chapterCount;
  }

  navigateToEditEntry = () => {
    if (this.state.isSliderActive) {
      const {
        currentUser,
        profile,
        libraryEntry,
        libraryStatus,
        libraryType,
        updateUserLibraryEntry,
      } = this.props;

      this.props.navigate(USER_LIBRARY_EDIT_SCREEN, {
        libraryEntry,
        libraryStatus,
        libraryType,
        profile,
        canEdit: profile.id === currentUser.id,
        ratingSystem: currentUser.ratingSystem,
        updateUserLibraryEntry,
      });
    }
  }

  saveEntry = async () => {
    // send the status from props because that is the list we're looking
    // at not the status from state because that is what the value of the
    // card may have just been changed to
    const { libraryEntry, libraryType } = this.props;
    const { libraryStatus: newStatus, progress, ratingTwenty } = this.state;

    this.props.updateUserLibraryEntry(libraryType, libraryEntry.status, {
      id: this.props.libraryEntry.id,
      progress,
      ratingTwenty,
      status: newStatus,
    });
  }

  debounceSave = debounce(this.saveEntry, 200);

  selectOptions = () => STATUS_SELECT_OPTIONS.map(option => ({
    value: option.value,
    text: option[this.props.libraryType],
  })).filter(option => option.value !== this.props.libraryEntry.status);

  render() {
    const { libraryEntry, libraryType, currentUser } = this.props;
    const { progressPercentage, isSliderActive } = this.state;
    const mediaData = libraryEntry[libraryType];
    const canEdit = this.props.profile.id === this.props.currentUser.id;
    const maxProgress = this.getMaxProgress();

    return (
      <Swipeable
        onRightActionActivate={this.onRightActionActivate}
        onRightActionDeactivate={this.onRightActionDeactivate}
        onRightActionComplete={this.navigateToEditEntry}
        onSwipeStart={this.onSwipeStart}
        onSwipeRelease={this.onSwipeRelease}
        rightActionActivationDistance={145}
        rightContent={[
          <View
            key={0}
            style={[
              styles.swipeButton,
              (isSliderActive ? styles.swipeButtonActive : styles.swipeButtonInactive),
            ]}
          >
            <Text style={styles.swipeButtonText}>{canEdit ? 'Edit Entry' : 'View Details'}</Text>
          </View>,
        ]}
      >
        <View style={styles.container}>
          { libraryEntry.status !== this.props.libraryStatus &&
            <View style={styles.moved}>
              <View style={styles.horizontalRule} />
              <Text style={styles.movedText}>
                Moved to <Text style={styles.movedToText}>
                  {HEADER_TEXT_MAPPING[libraryEntry.status][libraryType]}
                </Text>
              </Text>
              <View style={styles.horizontalRule} />
            </View>
          }
          <View style={styles.metaDataContainer}>
            <MediaCard
              cardDimensions={{ height: 75, width: 65 }}
              cardStyle={styles.posterImage}
              mediaData={mediaData}
              navigate={this.props.navigate}
            />

            <View style={styles.content}>
              <View style={styles.titleSection}>
                <Text
                  numberOfLines={1}
                  style={styles.titleText}
                >
                  {mediaData.canonicalTitle}
                </Text>
                {canEdit && (
                  <SelectMenu
                    options={this.selectOptions()}
                    onOptionSelected={this.onStatusSelected}
                    style={styles.menuButtonContainer}
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
                  backgroundStyle={styles.progressBarBackground}
                />
              </View>
              <View style={styles.statusSection}>
                <Counter
                  disabled={!canEdit}
                  initialValue={libraryEntry.progress}
                  maxValue={typeof maxProgress === 'number' ? maxProgress : undefined}
                  progressCounter={typeof maxProgress === 'number'}
                  onValueChanged={this.onProgressValueChanged}
                />
                <Rating
                  disabled={!canEdit}
                  size="small"
                  viewType="single"
                  onRatingChanged={this.onRatingChanged}
                  style={styles.ratingStyle}
                  rating={libraryEntry.ratingTwenty}
                  ratingSystem={currentUser.ratingSystem}
                />
              </View>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  }
}
