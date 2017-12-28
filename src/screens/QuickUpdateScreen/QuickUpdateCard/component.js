import React, { PureComponent } from 'react';
import { ActivityIndicator, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressBar } from 'kitsu/components/ProgressBar';
import PropTypes from 'prop-types';
import QuickUpdateEditor from '../QuickUpdateEditor';
import * as colors from 'kitsu/constants/colors';
import styles from './styles';

export default class QuickUpdateCard extends PureComponent {
  static propTypes = {
    // TODO: Not yet a complete definition of the things we use in data.
    data: PropTypes.shape({
      loading: PropTypes.bool,
      item: PropTypes.shape({
        anime: PropTypes.shape({
          canonicalTitle: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          posterImage: PropTypes.shape({
            large: PropTypes.string.isRequired,
          }),
        }).isRequired,
      }).isRequired,
    }).isRequired,
    onBeginEditing: PropTypes.func,
    onEndEditing: PropTypes.func,
    onMarkComplete: PropTypes.func,
    onViewDiscussion: PropTypes.func,
  };

  static defaultProps = {
    onBeginEditing: () => {},
    onEndEditing: () => {},
    onMarkComplete: () => {},
    onViewDiscussion: () => {},
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

  render() {
    const { data } = this.props;
    const { loading } = data.item;
    const { editing, editingUpdateText, updateText } = this.state;

    if (!data || !data.item || !data.item.anime || !data.item.unit || !data.item.unit.length) {
      return null;
    }

    const { anime, progress, unit } = data.item;

    let landscapeImage = unit && unit.length && unit[0].thumbnail && unit[0].thumbnail.original;
    if (!landscapeImage) {
      landscapeImage = anime.posterImage.large;
    }

    const squareImage = anime.posterImage.small;

    return (
      <View key={data.item.id} style={styles.wrapper}>
        {/* Episode Landscape Image */}
        <View style={[styles.posterImageWrapper, styles.shadow]}>
          <Image source={{ uri: landscapeImage }} style={styles.posterImage}>
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
              style={styles.posterImageGradient}
            />
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: squareImage }} style={styles.avatarImage} />
              <View style={styles.descriptionRow}>
                <Text style={styles.seriesTitle} numberOfLines={1}>
                  {anime.canonicalTitle}
                </Text>
                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                  <ProgressBar
                    color={colors.lightGreen}
                    height={6}
                    fillPercentage={progress / anime.episodeCount * 100}
                  />
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.currentEpisodeText}>Ep. {progress}</Text>
                  <Text style={styles.totalEpisodesText}> of {anime.episodeCount}</Text>
                </View>
              </View>
            </View>
          </Image>
        </View>

        {/* Card */}
        <View style={[styles.cardWrapper, styles.shadow]}>
          <View style={styles.cardHeaderWrapper}>
            <View style={styles.cardHeaderArea}>
              {/* Series Description */}
              <View style={styles.episodeRow}>
                <Text style={styles.seriesExtraInfo}>
                  UP NEXT{' '}
                  <Text style={styles.seriesNextEpisodeTitle}>EP 10 - Shouto Todoroki: Origin</Text>
                </Text>
              </View>
            </View>
          </View>
          {loading && <ActivityIndicator size="large" style={styles.loadingSpinner} />}
          {/* Action Row */}
          {!loading && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={this.onMarkComplete}
                style={[styles.button, styles.markWatchedButton]}
              >
                <Text style={styles.buttonText}>Mark </Text>
                <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>
                  Episode {data.item.progress}
                </Text>
                <Text style={styles.buttonText}> Watched</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Editor */}
        <Modal animationType="slide" transparent visible={editing}>
          <QuickUpdateEditor
            episode={data.item.progress}
            onChange={this.onEditorChanged}
            onCancel={this.toggleEditor}
            onDone={this.updateTextAndToggle}
            value={editingUpdateText}
          />
        </Modal>
      </View>
    );
  }
}
