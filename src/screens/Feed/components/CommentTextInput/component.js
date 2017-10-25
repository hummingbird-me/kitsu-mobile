import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from 'kitsu/constants/colors';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { styles } from './styles';

export class CommentTextInput extends PureComponent {
  static propTypes = {
    inputRef: PropTypes.func,
    currentUser: PropTypes.object,
    placeholderText: PropTypes.string,
    showAvatar: PropTypes.bool,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    inputRef: null,
    currentUser: {},
    placeholderText: 'Write a comment...',
    showAvatar: true,
    onSubmit: null,
  }

  state = {
    isFocused: false,
  }

  handleOnFocus = (isFocused) => {
    this.setState({ isFocused });
  }

  render() {
    const {
      inputRef,
      currentUser,
      showAvatar,
      placeholderText,
      onSubmit,
      ...props
    } = this.props;

    return (
      <Layout.RowWrap alignItems="center">
        {showAvatar && <Avatar avatar={currentUser.avatar && currentUser.avatar.medium} size="small" />}
        <Layout.RowMain>
          <View style={styles.textInputBox}>
            <TextInput
              ref={inputRef}
              style={styles.textInputField}
              onBlur={() => this.handleOnFocus(false)}
              onFocus={() => this.handleOnFocus(true)}
              placeholder={placeholderText}
              placeholderTextColor={colors.grey}
              {...props}
            />
          </View>
        </Layout.RowMain>
        {this.state.isFocused && (
          <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
            <Icon name="md-send" color={colors.blue} style={{ fontSize: 24 }} />
          </TouchableOpacity>
        )}
      </Layout.RowWrap>
    );
  }
}
