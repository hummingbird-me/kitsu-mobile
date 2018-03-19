import * as React from 'react';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { Text, TextInput, View, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { STATUS_SELECT_OPTIONS } from 'kitsu/screens/Profiles/UserLibrary';
import { Counter } from 'kitsu/components/Counter';
import { Rating } from 'kitsu/components/Rating';
import { SimpleHeader } from 'kitsu/components/SimpleHeader';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { isNull } from 'lodash';
import { styles } from './styles';

const visibilityOptions = [
  { text: 'Private', value: true },
  { text: 'Public', value: false },
  { text: 'Nevermind', value: 'cancel' },
];

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
    finishedAt: this.getLibraryEntry().finishedAt,
    notes: this.getLibraryEntry().notes,
    private: this.getLibraryEntry().private,
    progress: this.getLibraryEntry().progress,
    ratingTwenty: this.getLibraryEntry().ratingTwenty,
    reconsumeCount: this.getLibraryEntry().reconsumeCount,
    startedAt: this.getLibraryEntry().startedAt,
    status: this.getLibraryEntry().status,
    loading: false,
    error: null,
  }

  onFinishedAtChanged = (finishedAt) => {
    this.setState({ finishedAt });
  }

  onNotesChanged = (notes) => {
    this.setState({ notes });
  }

  onVisibilityChanged = (isPrivate) => {
    this.setState({ private: isPrivate });
  }

  onProgressValueChanged = (progress) => {
    this.setState({ progress });
  }

  onRatingChanged = (ratingTwenty) => {
    this.setState({ ratingTwenty });
  }

  onTimesRewatchedChanged = (timesRewatched) => {
    this.setState({ timesRewatched });
  }

  onStartedAtChanged = (startedAt) => {
    this.setState({ startedAt });
  }

  onStatusChanged = (libraryStatus) => {
    this.setState({ status: libraryStatus });
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

    try {
      await updateUserLibraryEntry(libraryType, libraryStatus, {
        id: libraryEntry.id,
        finishedAt,
        notes: (notes && notes.trim()),
        progress,
        ratingTwenty,
        reconsumeCount,
        startedAt,
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
            {/* @TODO: Needs to be editable */}
            <View style={styles.splitRow}>
              <View style={[styles.editRow, styles.dateStarted]}>
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
              </View>
              <View style={[styles.editRow, styles.dateFinished]}>
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
              </View>
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
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}
