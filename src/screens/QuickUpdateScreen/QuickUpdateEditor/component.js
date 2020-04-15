import React, { PureComponent } from 'react';
import { Animated, Text, Platform } from 'react-native';
import { HeaderButton } from 'kitsu/screens/Feed/components/HeaderButton';
import { PostCreator } from 'kitsu/screens/Feed/components/PostCreator';
import PropTypes from 'prop-types';
import styles from './styles';
import I18n from 'kitsu/translations/i18n';

export default class QuickUpdateEditor extends PureComponent {
  static propTypes = {
    media: PropTypes.object.isRequired,
    currentEpisode: PropTypes.object.isRequired,
    progress: PropTypes.number.isRequired,
    onCancel: PropTypes.func,
    onPostCreated: PropTypes.func,
  };

  static defaultProps = {
    onCancel: () => {},
    onPostCreated: () => {},
  };

  state = {
    headerOpacity: new Animated.Value(0),
  };

  componentDidMount = () => {
    // Animate the header in after the slide.
    const { headerOpacity } = this.state;

    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 300,
      delay: 200,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const { progress, onCancel, onPostCreated, media, currentEpisode } = this.props;
    const { headerOpacity } = this.state;

    return (
      <PostCreator
        media={media}
        spoiledUnit={currentEpisode}
        placeholder={`(I18n.t("screens.quickupdatescreen.editor.share")) ${progress}`}
        spoiler
        hideMeta
        disableMedia
        style={styles.wrapper}
        editorContainerStyle={styles.editorWrapper}
        onPostCreated={onPostCreated}
        onCancel={onCancel}
        renderHeader={(busy, isEditing, onPostPress, onCancelPress) => (
          <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
            {/* Dummy View, helps with layout to center text */}
            <HeaderButton
              title={I18n.t("screens.quickupdatescreen.editor.cancel")}
              onPress={onCancelPress}
              style={styles.headerButton}
              textStyle={styles.headerButtonText}
            />
            <Text style={styles.headerText}>{I18n.t("screens.quickupdatescreen.editor.episode")} {progress}</Text>
            <HeaderButton
              title={I18n.t("screens.quickupdatescreen.editor.done")}
              onPress={onPostPress}
              disabled={busy}
              loading={busy}
              style={styles.headerButton}
              textStyle={styles.headerButtonText}
            />
          </Animated.View>
        )}
        // For some reason if we have `avoidKeyboard` set to `true` on an android device,
        // It messes up the layout and thus the user can't do anything
        avoidKeyboard={Platform.OS === 'ios'}
      />
    );
  }
}
