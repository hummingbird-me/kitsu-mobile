import * as React from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { Text, TextInput, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { STATUS_SELECT_OPTIONS } from 'kitsu/screens/Profiles/UserLibrary';
import { Counter } from 'kitsu/components/Counter';
import { Rating } from 'kitsu/components/Rating';
import { SimpleHeader } from 'kitsu/components/SimpleHeader';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { isNull, isEmpty } from 'lodash';
import { DatePicker } from 'kitsu/components/DatePicker';
import { styles } from './styles';

const visibilityOptions = [
  { text: 'Private', value: true },
  { text: 'Public', value: false },
  { text: 'Nevermind', value: 'cancel' },
];

const parseISO8601Date = (date) => {
  if (typeof date !== 'string') return date;
  if (isEmpty(date)) return null;
  return moment(date, moment.ISO_8601).toDate();
};


export class UserLibraryEditScreenComponent extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    deleteUserLibraryEntry: PropTypes.func.isRequired,
  }

  static navigationOptions = () => ({
    headerStyle: {
      shadowColor: 'transparent',
      elevation: 0,
    },
    header: null,
  });

  state = {
    notes: this.getLibraryEntry().notes,
    private: this.getLibraryEntry().private,
    progress: this.getLibraryEntry().progress,
    ratingTwenty: this.getLibraryEntry().ratingTwenty,
    reconsumeCount: this.getLibraryEntry().reconsumeCount,
    startedAt: parseISO8601Date(this.getLibraryEntry().startedAt),
    finishedAt: parseISO8601Date(this.getLibraryEntry().finishedAt),
    status: this.getLibraryEntry().status,
    loading: false,
    error: null,
  }

  onNotesChanged = (notes) => {
    this.setState({ notes });
  }

  onVisibilityChanged = (isPrivate) => {
    this.setState({ private: isPrivate });
  }

  onProgressValueChanged = (progress) => {
    // Check if user has completed the media
    const maxProgress = this.getMaxProgress();
    const hasCompletedMedia = maxProgress && progress >= maxProgress;
    const other = {};

    if (hasCompletedMedia && this.state.status !== 'completed') {
      other.status = 'completed';

      // If we haven't set the finishedAt date then set it now
      if (!this.state.finishedAt) other.finishedAt = new Date();
    }

    this.setState({ progress, ...other });
  }

  onRatingChanged = (ratingTwenty) => {
    this.setState({ ratingTwenty });
  }

  onTimesRewatchedChanged = (timesRewatched) => {
    this.setState({ reconsumeCount: timesRewatched });
  }

  onStatusChanged = (libraryStatus) => {
    const { startedAt, finishedAt } = this.state;

    // Check if we need to set the start and finish dates
    const dates = {};
    if (libraryStatus === 'current' && !startedAt) {
      dates.startedAt = new Date();
    } else if (libraryStatus === 'completed' && !finishedAt) {
      dates.finishedAt = new Date();
    }

    this.setState({ status: libraryStatus, ...dates });
  }

  onDateStartedPress = () => {
    const { libraryEntry, libraryType } = this.props.navigation.state.params;
    const { startedAt, finishedAt } = this.state;

    const mediaData = libraryEntry[libraryType];
    const startDate = mediaData && mediaData.startDate;

    // Cap the minimum to the media start date
    // Cap the max to entry finish date or the current date
    const min = startDate && moment(startDate, 'YYYY-MM-DD').toDate();
    const max = finishedAt || new Date();

    this.datePicker.show(startedAt, min, max, (newDate) => {
      this.setState({ startedAt: newDate });
    });
  }

  onDateFinishedPress = () => {
    const { libraryEntry, libraryType } = this.props.navigation.state.params;
    const { startedAt, finishedAt } = this.state;

    // Cap the minimum to the start date and max to the finish date
    const mediaData = libraryEntry[libraryType];

    // If the start date is set then we should only be able to pick dates after that
    // If the end date is not set then set the current date as maximum
    const startDate = mediaData && mediaData.startDate;
    const min = startedAt || (startDate && moment(startDate, 'YYYY-MM-DD').toDate());
    const max = new Date();

    this.datePicker.show(finishedAt, min, max, (newDate) => {
      this.setState({ finishedAt: newDate });
    });
  }

  onDeleteEntry = async () => {
    const { libraryEntry, libraryType } = this.props.navigation.state.params;
    this.setState({ loading: true, error: null });
    try {
      await this.props.deleteUserLibraryEntry(libraryEntry.id, libraryType, libraryEntry.status);
      this.setState({ loading: false });
      this.props.navigation.goBack();
    } catch (e) {
      this.setState({ loading: false, error: e });
      console.log(e);
    }
  }

  getMaxProgress() {
    const { libraryEntry, libraryType } = this.props.navigation.state.params;
    const mediaData = libraryEntry[libraryType];
    if (!mediaData) return null;

    if (mediaData.type === 'anime') {
      return mediaData.episodeCount;
    }

    return mediaData.chapterCount;
  }

  getLibraryEntry() {
    return this.props.navigation.state.params.libraryEntry;
  }

  selectOptions = STATUS_SELECT_OPTIONS.map(option => ({
    value: option.value,
    text: option[this.props.navigation.state.params.libraryType],
  })).filter(option => option.value !== this.props.navigation.state.params.libraryStatus);

  saveEntry = async () => {
    // send the status from props because that is the list we're looking
    // at not the status from state because that is what the value of the
    // card may have just been changed to
    const {
      libraryEntry,
      libraryStatus,
      libraryType,
      updateUserLibraryEntry,
    } = this.props.navigation.state.params;

    const {
      finishedAt,
      notes,
      private: isPrivate,
      ratingTwenty,
      startedAt,
      status,
    } = this.state;

    let { progress, reconsumeCount } = this.state;
    // @Hack: Unblur the inputs and update the value locally here
    // as the call to `onProgressValueChanged` will not apply before the upstream changes
    // This is a QoL hack so that users can have their changes to inputs applied
    // without the direct need to tap somewhere to unblur first.
    // @Note: This is marked as a hack due to usage of `_lastNativeText`.
    if (this.progressInput && this.progressInput.isFocused()) {
      this.progressInput.blur();
      const value = parseInt(this.progressInput._lastNativeText, 10);
      if (progress !== value) {
        progress = value;
      }
    } else if (this.rewatchInput && this.rewatchInput.isFocused()) {
      this.rewatchInput.blur();
      const value = parseInt(this.rewatchInput._lastNativeText, 10);
      if (reconsumeCount !== value) {
        reconsumeCount = value;
      }
    }

    this.setState({ loading: true, error: null });

    // Convert dates to UTC strings
    const startDate = startedAt && moment.utc(startedAt).format();
    const finishDate = finishedAt && moment.utc(finishedAt).format();

    try {
      await updateUserLibraryEntry(libraryType, libraryStatus, {
        id: libraryEntry.id,

        notes: (notes && notes.trim()),
        progress,
        ratingTwenty,
        reconsumeCount,
        startedAt: startDate,
        finishedAt: finishDate,
        status,
        private: isPrivate,
      });
      this.setState({ loading: false });
      this.props.navigation.goBack();
    } catch (e) {
      this.setState({ loading: false, error: e });
      console.log(e);
    }
  }

  render() {
    const { canEdit, libraryEntry, libraryType, ratingSystem } = this.props.navigation.state.params;
    const {
      loading,
      error,
      finishedAt,
      startedAt,
      status: stateStatus,
      ratingTwenty,
      notes,
      private: isPrivate,
      progress,
    } = this.state;

    const rightTitle = loading ? 'Saving' : 'Save';
    const leftTitle = loading ? null : 'Cancel';

    const maxProgress = this.getMaxProgress();

    // { value: 'current', anime: 'Currently Watching', manga: 'Currently Reading' },
    const status = STATUS_SELECT_OPTIONS.filter(item => item.value === stateStatus)[0][libraryType];

    return (
      <View style={styles.container}>
        <SimpleHeader
          leftAction={!loading && this.props.navigation.goBack}
          leftContent={canEdit ? leftTitle : 'Done'}
          titleContent={canEdit ? 'Edit Entry' : 'Details'}
          rightContent={canEdit ? rightTitle : null}
          rightAction={!loading && this.saveEntry}
        />
        {/* Container for the content below the header */}
        <View style={{ flex: 1 }}>

          {/* Loading */}
          {loading &&
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
          }

          {/* Error */}
          {!isNull(error) &&
            <View style={styles.error}>
              <Text style={styles.errorText}>
                Error: {error.detail || 'Something went wrong'}
              </Text>
            </View>
          }

          {/* Fields */}
          <KeyboardAwareScrollView>
            {/* Status */}
            <View style={styles.editRow}>
              <Text style={styles.editRowLabel}>
                Library Status:
              </Text>
              <SelectMenu
                disabled={!canEdit}
                options={this.selectOptions}
                onOptionSelected={this.onStatusChanged}
              >
                <Text style={styles.editRowValue}>
                  {status}
                </Text>
              </SelectMenu>
            </View>
            {/* Progress */}
            <View style={styles.editRow}>
              <Text style={styles.editRowLabel}>
                {libraryType === 'anime' ? 'Episode' : 'Chapter'} Progress:
              </Text>
              <Counter
                inputRef={(r) => { this.progressInput = r; }}
                disabled={!canEdit}
                value={progress}
                initialValue={libraryEntry.progress}
                maxValue={typeof maxProgress === 'number' ? maxProgress : undefined}
                progressCounter={typeof maxProgress === 'number'}
                onValueChanged={this.onProgressValueChanged}
              />
            </View>
            {/* Rating */}
            <View style={styles.editRow}>
              <Text style={styles.editRowLabel}>Rating:</Text>
              <Rating
                disabled={!canEdit}
                size="large"
                viewType="single"
                onRatingChanged={this.onRatingChanged}
                style={styles.ratingStyle}
                ratingTwenty={ratingTwenty}
                ratingSystem={ratingSystem}
              />
            </View>
            {/* Rewatched */}
            <View style={styles.editRow}>
              <Text style={styles.editRowLabel}>
                Times {libraryType === 'anime' ? 'Rewatched' : 'Read'}:
              </Text>
              <Counter
                inputRef={(r) => { this.rewatchInput = r; }}
                disabled={!canEdit}
                initialValue={libraryEntry.reconsumeCount}
                onValueChanged={this.onTimesRewatchedChanged}
              />
            </View>
            {/* Visibility */}
            <View style={styles.editRow}>
              <Text style={styles.editRowLabel}>
                Library Entry Visibility:
              </Text>
              <SelectMenu
                disabled={!canEdit}
                options={visibilityOptions}
                onOptionSelected={this.onVisibilityChanged}
              >
                <Text style={styles.editRowValue}>
                  {isPrivate ? 'Private' : 'Public'}
                </Text>
              </SelectMenu>
            </View>
            {/* Dates */}
            <View style={styles.splitRow}>
              <TouchableOpacity
                style={[styles.editRow, styles.dateStarted]}
                disbaled={!canEdit}
                onPress={this.onDateStartedPress}
              >
                <View>
                  <Text style={[
                    styles.editRowLabel,
                    startedAt && styles.withValueLabel,
                  ]}
                  >
                    Date Started
                  </Text>
                  {startedAt &&
                    <Text style={styles.editRowValue}>
                      {moment(startedAt).format('MMM. DD, YYYY')}
                    </Text>
                  }
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editRow, styles.dateFinished]}
                disbaled={!canEdit}
                onPress={this.onDateFinishedPress}
              >
                <View>
                  <Text style={[
                    styles.editRowLabel,
                    finishedAt && styles.withValueLabel,
                  ]}
                  >
                    Date Finished
                  </Text>
                  {finishedAt &&
                    <Text style={styles.editRowValue}>
                      {moment(finishedAt).format('MMM. DD, YYYY')}
                    </Text>
                  }
                </View>
              </TouchableOpacity>
            </View>
            {/* Notes */}
            <View style={[styles.editRow, { maxHeight: 'auto' }]}>
              <View style={styles.notesSection}>
                <Text style={[styles.editRowLabel, styles.withValueLabel]}>
                  Personal Notes
                </Text>
                <TextInput
                  style={[styles.editRowValue]}
                  value={notes}
                  placeholder={canEdit ? "Type some notes..." : "User has no notes"}
                  onChangeText={this.onNotesChanged}
                  editable={canEdit}
                  multiline
                />
              </View>
            </View>
            {/* Delete */}
            {canEdit &&
              <View style={[styles.deleteEntryRow]}>
                <SelectMenu options={['Yes, Delete.', 'Nevermind']} onOptionSelected={this.onDeleteEntry}>
                  <Text style={styles.deleteEntryText}>Delete Library Entry</Text>
                </SelectMenu>
              </View>
            }
            <DatePicker ref={(d) => { this.datePicker = d; }} />
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}
