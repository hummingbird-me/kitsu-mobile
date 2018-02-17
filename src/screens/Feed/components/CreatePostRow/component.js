import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { defaultAvatar } from 'kitsu/constants/app';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { styles } from './styles';

const CreatePostRowComponent = ({ currentUser, targetUser, onPress, title }) => {
  const defaultTitle = `Want to share an update, ${currentUser.name}?`;
  const shareTitle = `Share an update with ${targetUser ? targetUser.name : 'Someone'}`;
  const isTargetCurrentUser = targetUser ? targetUser.id === currentUser.id : true;
  return (
    <View style={styles.wrap}>
      <TouchableOpacity onPress={onPress}>
        <Layout.RowWrap alignItems="center">
          <Avatar avatar={(currentUser.avatar && currentUser.avatar.medium) || defaultAvatar} />
          <Layout.RowMain>
            <StyledText color="grey" size="xsmall">
              {title || (isTargetCurrentUser ? defaultTitle : shareTitle)}
            </StyledText>
          </Layout.RowMain>
        </Layout.RowWrap>
      </TouchableOpacity>
    </View>
  );
};

CreatePostRowComponent.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string,
    avatar: PropTypes.shape({
      medium: PropTypes.string,
    }),
    name: PropTypes.string,
  }).isRequired,
  targetUser: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onPress: PropTypes.func,
  title: PropTypes.string,
};

CreatePostRowComponent.defaultProps = {
  currentUser: null,
  targetUser: null,
  onPress: null,
  title: null,
};

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const CreatePostRow = connect(mapStateToProps)(CreatePostRowComponent);
