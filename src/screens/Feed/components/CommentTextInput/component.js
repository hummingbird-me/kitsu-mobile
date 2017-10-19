import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from 'kitsu/constants/colors';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { styles } from './styles';

export class CommentTextInput extends Component {
  state = {
    isFocused: false,
  }

  handleOnFocus = (isFocused) => {
    this.setState({ isFocused });
  }

  render() {
    const {
      inputRef,
      avatar,
      showAvatar,
      placeholder,
      onSubmit,
      ...props
    } = this.props;

    return (
      <Layout.RowWrap alignItems="center">
        {showAvatar && <Avatar avatar={avatar} size="small" />}
        <Layout.RowMain>
          <View style={styles.textInputBox}>
            <TextInput
              ref={inputRef}
              style={styles.textInputField}
              onBlur={() => this.handleOnFocus(false)}
              onFocus={() => this.handleOnFocus(true)}
              placeholder={placeholder}
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

CommentTextInput.propTypes = {
  inputRef: PropTypes.func,
  avatar: PropTypes.string,
  placeholder: PropTypes.string,
  showAvatar: PropTypes.bool,
  onSubmit: PropTypes.func,
};

CommentTextInput.defaultProps = {
  inputRef: null,
  avatar: null,
  placeholder: 'Write a comment...',
  showAvatar: true,
  onSubmit: null,
};
