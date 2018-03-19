import React, { PureComponent } from 'react';
import { ActivityIndicator, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressBar } from 'kitsu/components/ProgressBar';
import { Rating } from 'kitsu/components/Rating';
import PropTypes from 'prop-types';
import styles from './styles';

export default class QuickUpdateCard extends PureComponent {
  static propTypes = {
    // TODO: Not yet a complete definition of the things we use in data.
    ratingSystem: PropTypes.string.isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      item: PropTypes.shape({
        anime: PropTypes.shape({
          canonicalTitle: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          posterImage: PropTypes.shape({
            large: PropTypes.string.isRequired,
          }),
        }),
        manga: PropTypes.shape({
          canonicalTitle: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          posterImage: PropTypes.shape({
            large: PropTypes.string.isRequired,
          }),
        }),
      }).isRequired,
    }).isRequired,
    onBeginEditing: PropTypes.func,
    onEndEditing: PropTypes.func,
    onMarkComplete: PropTypes.func,
    onRate: PropTypes.func.isRequired,
    onMediaTapped: PropTypes.func,
  };

  static defaultProps = {
    onBeginEditing: () => { },
    onEndEditing: () => { },
    onMarkComplete: () => { },
    onMediaTapped: () => { },
  };

  state = {
    editing: false,
    // Note, this is needed because if we just work with updateText, whenever we cancel and have
    // had text previously in the editor, we get a native exception on iOS about being unable
    // to locate a view with a tag.
    editingUpdateText: null,
    updateText: null,
  };

  componentWillReceiveProps = (nextProps) => {
    // This means they've likely reloaded the data.
    if (this.props.data !== nextProps.data) {
      this.setState({
        editingUpdateText: null,
        updateText: null,
      });
    }
  };

  onEditorChanged = (editingUpdateText) => {
    this.setState({ editingUpdateText });
  };

  onViewDiscussion = () => {
    this.props.onViewDiscussion(this.props.data.item);
  };

  onMarkComplete = () => {
    this.props.onMarkComplete(this.props.data.item);
  };

  onMediaTapped = (media) => {
    if (media) {
      this.props.onMediaTapped(media);
    }
  }

  updateTextAndToggle = () => {
    // Restore any previous text, and then toggle the editor.
    this.setState({ updateText: this.state.editingUpdateText }, () => {
      this.toggleEditor();
    });
  };

  toggleEditor = () => {
    const { loading } = this.props.data;
    const { editing, updateText } = this.state;

    if (!loading && !editing) {
      this.setState({
        editing: true,
        // Need to copy the current updateText over so the dialog shows with the correct text in it.
        editingUpdateText: updateText,
      });
      this.props.onBeginEditing();
    } else {
      this.setState({ editing: false });
      this.props.onEndEditing();
    }
  };

  renderRatingComponent = () => {
    const { data, ratingSystem, onRate } = this.props;

    return (
      <Rating
        ratingSystem={ratingSystem}
        ratingTwenty={data.item.ratingTwenty}
        onRatingChanged={onRate}
      />
    );
  };

  render() {
    const { data } = this.props;
    if (!data || !data.item || (!data.item.anime && !data.item.manga)) {
      console.warn('Missing Quick Update Card data!');
      return null;
    }

    let { unit } = data.item;
    const { loading, anime, manga, progress, nextUnit } = data.item;

    // Might be a new entry and referencing a non-existent unit for episode 0
    if ((!unit || !unit.length) && nextUnit) {
      unit = [nextUnit];
    }

    const media = anime || manga;
    const unitCount = media.episodeCount || media.chapterCount;
    const isCompleted = data.item.status === 'completed';
    const nextProgress = progress + 1;

    const landscapeImage = (unit && unit.length && unit[0].thumbnail && unit[0].thumbnail.original) ||
                          (media && media.posterImage && media.posterImage.large);

    const squareImage = media && media.posterImage && media.posterImage.small;
    return (
      <View key={data.item.id} style={styles.wrapper}>
        {/* Episode Landscape Image */}
        <View style={[styles.posterImageWrapper, styles.shadow]}>
          <ImageBackground
            source={{ uri: landscapeImage }}
            style={styles.posterImage}
            imageStyle={{ resizeMode: 'cover' }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 1)']}
              style={styles.posterImageGradient}
            />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => this.onMediaTapped(media)}>
                <FastImage source={{ uri: squareImage }} style={styles.avatarImage} />
              </TouchableOpacity>
              <View style={styles.descriptionRow}>
                <TouchableOpacity onPress={() => this.onMediaTapped(media)}>
                  <Text style={styles.seriesTitle} numberOfLines={1}>
                    {media.canonicalTitle}
                  </Text>
                </TouchableOpacity>
                {/* Progress Bar */}
                {unitCount > 0 && (
                  <View style={styles.progressBarContainer}>
                    <ProgressBar
                      backgroundStyle={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                      height={6}
                      fillPercentage={(progress / unitCount) * 100}
                    />
                  </View>
                )}
                {/* Progress State */}
                {progress > 0 ? (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.currentEpisodeText}>
                      {media.type === 'anime' ? 'EP' : 'CH'}
                      {' '}
                      {progress}
                    </Text>
                    <Text numberOfLines={1} style={styles.totalEpisodesText}>
                      {unitCount > 0 && (
                        ` of ${unitCount}`
                      )}
                      {' '}
                      {unit[0] && unit[0].canonicalTitle}
                    </Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.totalEpisodesText}>Not Started</Text>
                  </View>
                )}
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Card */}
        <View style={[styles.cardWrapper, styles.shadow]}>
          <View style={styles.cardHeaderWrapper}>
            <View style={styles.cardHeaderArea}>
              {/* Series Description */}
              <View style={styles.episodeRow}>
                {!isCompleted ? ( // finished ?
                  <Text style={styles.seriesExtraInfo} numberOfLines={1}>
                    UP NEXT{' '}
                    {nextUnit ? ( // Might not exist
                      <Text style={styles.seriesNextEpisodeTitle}>
                        {media.type === 'anime' ? 'EP' : 'CH'}
                        {' '}
                        {nextUnit.number} {nextUnit.canonicalTitle ? `- ${nextUnit.canonicalTitle}` : ''}
                      </Text>
                    ) : (
                      <Text style={styles.seriesNextEpisodeTitle}>
                        {media.type === 'anime' ? 'EP' : 'CH'}
                        {' '}
                        {nextProgress}
                      </Text>
                    )}
                  </Text>
                ) : (
                  <Text style={styles.seriesFinishedTitle}>Finished!</Text>
                )}
              </View>
            </View>
          </View>
          {loading && <ActivityIndicator size="large" style={styles.loadingSpinner} />}
          {/* Action Row */}
          {!loading &&
            (!isCompleted ? ( // finished ?
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={this.onMarkComplete}
                  style={[styles.button, styles.markWatchedButton]}
                >
                  {unitCount === progress + 1 ? ( // is final episode?
                    <Text style={styles.buttonText}>Mark as Complete</Text>
                  ) : (
                    <Text style={styles.buttonText}>Mark
                      <Text style={{ fontWeight: 'bold' }}>
                        {' '}{media.type === 'anime' ? 'Episode' : 'Chapter'}
                        {' '}
                        {data.item.progress + 1}{' '}
                      </Text>
                      {media.type === 'anime' ? 'Watched' : 'Read'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.seriesCompleteText}>Series Complete! Rate it!</Text>
                {this.renderRatingComponent()}
              </View>
            ))}
        </View>
      </View>
    );
  }
}
