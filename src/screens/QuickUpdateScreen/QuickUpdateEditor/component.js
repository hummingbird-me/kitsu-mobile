import React, { PureComponent } from 'react';
import { Animated, Text, Platform } from 'react-native';
import { HeaderButton } from 'app/screens/Feed/components/HeaderButton';
import { PostCreator } from 'app/screens/Feed/components/PostCreator';
import PropTypes from 'prop-types';
import styles from './styles';

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
        placeholder={`Share your thoughts on Episode ${progress}`}
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
              title="Cancel"
              onPress={onCancelPress}
              style={styles.headerButton}
              textStyle={styles.headerButtonText}
            />
            <Text style={styles.headerText}>Episode {progress}</Text>
            <HeaderButton
              title="Done"
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
