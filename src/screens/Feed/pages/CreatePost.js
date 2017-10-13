import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, View } from 'react-native';
import { defaultAvatar } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { PostMeta } from 'kitsu/screens/Feed/components/PostMeta';
import { PostTextInput } from 'kitsu/screens/Feed/components/PostTextInput';
import { HeaderButton } from 'kitsu/screens/Feed/components/HeaderButton';
import { PickerModal } from 'kitsu/screens/Feed/components/PickerModal';
import { FEED_STREAMS } from '../stub';

class CreatePost extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Create Post',
      headerLeft: <HeaderButton onPress={() => navigation.goBack()} title="Cancel" />,
      headerRight: <HeaderButton highlighted onPress={params.handlePressPost} title="Post" />,
    };
  };

  state = {
    feedPickerModalIsVisible: false,
    statusContent: '',
    currentFeed: FEED_STREAMS[0],
  };

  handleFeedPicker = (currentFeed) => {
    this.setState({ currentFeed });
    this.postTextInput.focus();
    this.handleFeedPickerModal(false);
  }

  handleFeedPickerModal = (feedPickerModalIsVisible) => {
    this.setState({ feedPickerModalIsVisible });
  }


  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      >
        <View style={{ flex: 1 }}>
          <PostMeta
            avatar={defaultAvatar}
            author="Josh"
            feedTitle={this.state.currentFeed.title}
            onFeedPillPress={() => this.handleFeedPickerModal(true)}
          />
          <PostTextInput
            inputRef={el => this.postTextInput = el}
            multiline
            numberOfLines={4}
            onChangeText={value => this.setState({ statusContent: value })}
            value={this.state.statusContent}
            placeholder="Write something...."
            placeholderTextColor={colors.grey}
            autoCorrect={false}
            autoFocus
            returnKeyType="done"
          />
        </View>
        <PickerModal
          visible={this.state.feedPickerModalIsVisible}
          data={FEED_STREAMS}
          currentPick={this.state.currentFeed}
          onCancelPress={() => this.handleFeedPickerModal(false)}
          onDonePress={feed => this.handleFeedPicker(feed)}
        />
      </KeyboardAvoidingView>
    );
  }
}

CreatePost.propTypes = {
  navigation: PropTypes.object,
};

CreatePost.defaultProps = {
  navigation: {},
};

export default CreatePost;
