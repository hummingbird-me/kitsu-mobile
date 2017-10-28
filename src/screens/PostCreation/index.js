import React, { PureComponent } from 'react';
import { View, KeyboardAvoidingView, TextInput } from 'react-native';

import PostMeta from './postMeta';
import styles from './styles';
import NavButton from './navButton';
import AddToPost from './addToPost';

class PostCreationScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Create Post',
      headerLeft: <NavButton onPress={() => navigation.goBack(null)}>Cancel</NavButton>,
      headerRight: <NavButton onPress={params.handlePressPost}>Post</NavButton>,
    };
  };

  state = {
    statusText: '',
  };

  componentDidMount() {
    this.props.navigation.setParams({
      handlePressPost: this.handlePressPost,
    });
  }

  handlePressPost = () => {
    console.log('cancelled called');
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <View style={styles.statusContainer}>
          <PostMeta avatar={require('../../assets/img/default_avatar.png')} author="Bilal" />

          <TextInput
            multiline
            numberOfLines={4}
            onChangeText={t => this.setState({ statusText: t })}
            value={this.state.statusText}
            placeholder="Write something...."
            placeholderTextColor="grey"
            autoCorrect={false}
            autoFocus
            returnKeyType="done"
            style={styles.textInput}
          />
        </View>

        <AddToPost />
      </KeyboardAvoidingView>
    );
  }
}

export default PostCreationScreen;
