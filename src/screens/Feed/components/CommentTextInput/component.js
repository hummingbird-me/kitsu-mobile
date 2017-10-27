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
    currentUser: PropTypes.object.isRequired,
    placeholderText: PropTypes.string,
    showAvatar: PropTypes.bool,
    onSubmit: PropTypes.func,
    comment: PropTypes.string,
    onCommentChanged: PropTypes.func,
  }

  static defaultProps = {
    inputRef: null,
    placeholderText: 'Write a comment...',
    showAvatar: true,
    onSubmit: null,
    comment: '',
    onCommentChanged: null,
  }

  render() {
    const {
      inputRef,
      currentUser,
      showAvatar,
      placeholderText,
      comment,
      onCommentChanged,
      onSubmit,
    } = this.props;

    return (
      <Layout.RowWrap alignItems="center">
        {showAvatar && <Avatar avatar={currentUser.avatar && currentUser.avatar.medium} size="small" />}
        <Layout.RowMain>
          <View style={styles.textInputBox}>
            <TextInput
              ref={inputRef}
              style={styles.textInputField}
              placeholder={placeholderText}
              placeholderTextColor={colors.grey}
              onChangeText={onCommentChanged}
              value={comment}
            />
          </View>
        </Layout.RowMain>
        {!!comment && (
          <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
            <Icon name="md-send" color={colors.blue} style={styles.submitButtonIcon} />
          </TouchableOpacity>
        )}
      </Layout.RowWrap>
    );
  }
}
