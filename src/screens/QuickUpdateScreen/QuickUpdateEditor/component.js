import React, { PureComponent } from 'react';
import { Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MediaTag } from 'kitsu/screens/Feed/components/MediaTag';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';

import styles from './styles';

const HIT_SLOP = {
  top: 10,
  left: 10,
  bottom: 10,
  right: 10,
};

export default class QuickUpdateEditor extends PureComponent {
  static propTypes = {
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
    const { progress, value, onCancel, onDone, currentEpisode } = this.props;
    const { headerOpacity } = this.state;
    return (
      <View style={styles.wrapper}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          {/* Dummy View, helps with layout to center text */}
          <TouchableOpacity onPress={onCancel} hitSlop={HIT_SLOP} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Episode {progress}</Text>
          <TouchableOpacity onPress={onDone} hitSlop={HIT_SLOP} style={styles.headerButton}>
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
            media={currentEpisode}
            episode={currentEpisode}
            navigation={navigation}
          />
        </View>
      </View>
    );
  }
}
