import React, { PureComponent } from 'react';
import { Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MediaTag } from 'kitsu/screens/Feed/components/MediaTag';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { GIFImage } from 'kitsu/screens/Feed/pages/PostCreation/GIFImage';
import { AdditionalButton } from 'kitsu/screens/Feed/pages/PostCreation/AdditionalButton';
import { GiphyModal } from 'kitsu/screens/Feed/components/GiphyModal';
import { CheckBox } from 'react-native-elements';
import styles from './styles';

const HIT_SLOP = {
  top: 10,
  left: 10,
  bottom: 10,
  right: 10,
};

export default class QuickUpdateEditor extends PureComponent {
  static propTypes = {
    media: PropTypes.object.isRequired,
    currentEpisode: PropTypes.object.isRequired,
    progress: PropTypes.number.isRequired,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
    onDone: PropTypes.func,
    value: PropTypes.string,
  };

  static defaultProps = {
    onCancel: () => {},
    onChange: () => {},
    onDone: () => {},
    value: null,
  };

  state = {
    headerOpacity: new Animated.Value(0),
    giphyPickerModalIsVisible: false,
    gif: null,
    nsfw: false,
    spoiler: true,
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

  handleGiphy = (gif) => {
    this.setState({ gif });
    this.handleGiphyPickerModal(false);
  }

  handleGiphyPickerModal = (giphyPickerModalIsVisible) => {
    this.setState({ giphyPickerModalIsVisible });
  }

  render() {
    const { progress, value, onCancel, onDone, media, currentEpisode } = this.props;
    const { headerOpacity, giphyPickerModalIsVisible, gif, nsfw, spoiler } = this.state;

    return (
      <View style={styles.wrapper}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          {/* Dummy View, helps with layout to center text */}
          <TouchableOpacity onPress={onCancel} hitSlop={HIT_SLOP} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Episode {progress}</Text>
          <TouchableOpacity onPress={() => onDone(gif, nsfw, spoiler)} hitSlop={HIT_SLOP} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.editorWrapper}>
          <TextInput
            autoFocus
            multiline
            value={value}
            style={styles.editor}
            onChangeText={this.props.onChange}
            placeholder={`(Optional) Share your thoughts on Episode ${progress}`}
            placeholderTextColor={colors.lightGrey}
          />
          <MediaTag
            disabled
            media={media}
            episode={currentEpisode}
            navigation={navigation}
          />
          <View style={styles.checkboxContainer}>
            <CheckBox
              title="NSFW"
              containerStyle={styles.checkbox}
              checkedColor={colors.green}
              checked={nsfw}
              checkedIcon="check-circle"
              uncheckedIcon="circle-thin"
              onPress={() => this.setState({ nsfw: !nsfw })}
            />
            <CheckBox
              title="Spoiler"
              containerStyle={styles.checkbox}
              checkedColor={colors.green}
              checked={spoiler}
              checkedIcon="check-circle"
              uncheckedIcon="circle-thin"
              onPress={() => this.setState({ spoiler: !spoiler })}
            />
          </View>
          <View style={styles.gifWrapper}>
            {gif ?
              <GIFImage
                gif={gif}
                onClear={() => this.setState({ gif: null })}
              />
              :
              <AdditionalButton
                text="Search & Share Gif"
                icon="plus"
                color={colors.green}
                onPress={() => this.handleGiphyPickerModal(true)}
                style={styles.addGIF}
              />
            }
          </View>
        </View>
        <GiphyModal
          visible={giphyPickerModalIsVisible}
          onCancelPress={() => this.handleGiphyPickerModal(false)}
          onGifSelect={this.handleGiphy}
        />
      </View>
    );
  }
}
