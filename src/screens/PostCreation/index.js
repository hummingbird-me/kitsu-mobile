import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import NavButton from './navButton';
import Avatar from './avatar';

const style = {};

class PostCreationScreen extends Component {
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

          <View style={styles.metaContainer}>
            <Avatar source={require('../../assets/img/default_avatar.png')} />

            <View
              style={{
                marginLeft: 10,
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.authorText}>Bilal</Text>
              <Text style={styles.feedSelector}>
                Follower Feed
                <FontAwesome name="angle-down" style={{ paddingRight: 6 }} />
              </Text>
            </View>
          </View>

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

        <View style={styles.actionsContainer}>
          <Text style={styles.actionHeading}>Add to your post</Text>
          <View style={styles.actions}>
            <FontAwesome name="image" style={[styles.actionItem, styles.actionIcon]} />
            <Text style={[styles.actionItem, styles.actionGIF]}>GIF</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default PostCreationScreen;
