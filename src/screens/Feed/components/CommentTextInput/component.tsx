import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from 'kitsu/constants/colors';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { GiphyModal } from 'kitsu/screens/Feed/components/GiphyModal';
import { isEmpty } from 'lodash';
import { styles } from './styles';

export class CommentTextInput extends PureComponent {
  static propTypes = {
    inputRef: PropTypes.func,
    currentUser: PropTypes.object.isRequired,
    autoFocus: PropTypes.bool,
    placeholderText: PropTypes.string,
    showAvatar: PropTypes.bool,
    onSubmit: PropTypes.func,
    comment: PropTypes.string,
    onCommentChanged: PropTypes.func,
    onGifSelected: PropTypes.func,
    loading: PropTypes.bool,
    multiline: PropTypes.bool,
  }

  static defaultProps = {
    inputRef: null,
    autoFocus: false,
    placeholderText: 'Write a comment...',
    showAvatar: true,
    onSubmit: null,
    comment: '',
    onCommentChanged: null,
    onGifSelected: null,
    loading: false,
    multiline: false,
  }

  state = {
    gifModalVisible: false,
  }

  onGifSelect = (gif) => {
    this.setState({ gifModalVisible: false });
    if (this.props.onGifSelected) this.props.onGifSelected(gif);
  };

  render() {
    const {
      inputRef,
      currentUser,
      showAvatar,
      autoFocus,
      placeholderText,
      comment,
      onCommentChanged,
      onSubmit,
      loading,
      multiline,
    } = this.props;

    const { gifModalVisible } = this.state;

    return (
      <Layout.RowWrap alignItems="center">
        {showAvatar && <Avatar avatar={currentUser.avatar && currentUser.avatar.medium} size="small" />}
        <Layout.RowMain>
          <View style={styles.textInputBox}>
            <TextInput
              ref={inputRef}
              style={styles.textInputField}
              autoFocus={autoFocus}
              autoCapitalize="sentences"
              autoCorrect
              editable={!loading}
              placeholder={placeholderText}
              placeholderTextColor={colors.grey}
              onChangeText={onCommentChanged}
              value={comment}
              underlineColorAndroid="transparent"
              multiline={multiline}
              blurOnSubmit={!multiline}
            />
            <TouchableOpacity
              style={styles.gifButton}
              onPress={() => this.setState({ gifModalVisible: true })}
            >
              <Text style={styles.gifText}>GIF</Text>
            </TouchableOpacity>
          </View>
        </Layout.RowMain>
        {!isEmpty(comment.trim()) && (
          <TouchableOpacity onPress={onSubmit} style={styles.submitButton} disabled={loading}>
            { loading ?
              <ActivityIndicator color={colors.blue} />
              :
              <Icon name="md-send" color={colors.blue} style={styles.submitButtonIcon} />
            }
          </TouchableOpacity>
        )}
        <GiphyModal
          visible={gifModalVisible}
          onCancelPress={() => this.setState({ gifModalVisible: false })}
          onGifSelect={this.onGifSelect}
        />
      </Layout.RowWrap>
    );
  }
}
