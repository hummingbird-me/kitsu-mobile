import React, { PureComponent } from 'react';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from 'kitsu/components/ProgressBar';
import PropTypes from 'prop-types';

import QuickUpdateEditor from '../QuickUpdateEditor';

import styles from './styles';

export default class QuickUpdateCard extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      item: PropTypes.shape({
        anime: {
          canonicalTitle: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          posterImage: {
            large: PropTypes.string.isRequired,
          },
        },
      }).isRequired,
    }).isRequired,
    onBeginEditing: PropTypes.func,
    onEndEditing: PropTypes.func,
  }

  static defaultProps = {
    onBeginEditing: () => {},
    onEndEditing: () => {},
  }

  state = {
    editing: false,
    // Note, this is needed because if we just work with updateText, whenever we cancel and have
    // had text previously in the editor, we get a native exception on iOS about being unable
    // to locate a view with a tag.
    editingUpdateText: null,
    updateText: null,
  }

  onEditorChanged = (editingUpdateText) => {
    this.setState({ editingUpdateText });
  }

  updateTextAndToggle = () => {
    // Restore any previous text, and then toggle the editor.
    this.setState({ updateText: this.state.editingUpdateText }, () => {
      this.toggleEditor();
    });
  }

  toggleEditor = () => {
    const { editing, updateText } = this.state;

    if (!editing) {
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
  }

  render() {
    const { data } = this.props;
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
          <Image
            source={{ uri: landscapeImage }}
            style={styles.posterImage}
          >
            <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.8)']} style={styles.posterImageGradient} />
            <View style={styles.episodeRow}>
              <Text style={styles.currentEpisodeText}>Ep. {progress}</Text>
              <Text style={styles.totalEpisodesText}> of {anime.episodeCount}</Text>
            </View>
            <Text style={styles.episodeName} numberOfLines={1}>{unit[0].canonicalTitle}</Text>
          </Image>
        </View>

        {/* Card */}
        <View style={[styles.cardWrapper, styles.shadow]}>
          <View style={styles.cardHeaderArea}>
            <View style={styles.cardContent}>
              {/* Progress Bar */}
              <ProgressBar
                progress={data.item.progress / anime.episodeCount}
                style={styles.progressBar}
              />
              {/* Series Description */}
              <View style={styles.seriesDescriptionRow}>
                <Image source={{ uri: squareImage }} style={styles.avatarImage} />
                <View style={styles.descriptionRow}>
                  <Text style={styles.seriesTitle} numberOfLines={1}>{anime.canonicalTitle}</Text>
                  <Text style={styles.seriesExtraInfo}>Anime • {anime.startDate.split('-')[0]}</Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={this.toggleEditor} style={styles.placeholderWrapper}>
            <Text
              style={updateText ? styles.updateText : styles.placeholder}
            >
              {updateText || `(Optional) Share your thoughts on Episode ${data.item.progress}`}
            </Text>
          </TouchableOpacity>
          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.button, styles.discussionButton]}>
              <Text style={styles.buttonText}>View Discussion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.markWatchedButton]}>
              <Text style={styles.buttonText}>Mark </Text>
              <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Episode {data.item.progress}</Text>
              <Text style={styles.buttonText}> Watched</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Editor */}
        <Modal
          animationType="slide"
          transparent
          visible={editing}
        >
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
