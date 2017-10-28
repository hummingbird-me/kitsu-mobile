import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { defaultAvatar } from 'kitsu/constants/app';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { styles } from './styles';

const CreatePostRowComponent = ({ currentUser, onPress }) => (
  <View style={styles.wrap}>
    <TouchableOpacity onPress={onPress}>
      <Layout.RowWrap alignItems="center">
        <Avatar avatar={(currentUser.avatar && currentUser.avatar.medium) || defaultAvatar} />
        <Layout.RowMain>
          <StyledText color="grey" size="xsmall">Want to share an update, {currentUser.name}?</StyledText>
        </Layout.RowMain>
      </Layout.RowWrap>
    </TouchableOpacity>
  </View>
);

CreatePostRowComponent.propTypes = {
  currentUser: PropTypes.shape({
    avatar: PropTypes.shape({
      medium: PropTypes.string,
    }),
    name: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func,
};

CreatePostRowComponent.defaultProps = {
  currentUser: null,
  onPress: null,
};

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const CreatePostRow = connect(mapStateToProps)(CreatePostRowComponent);
