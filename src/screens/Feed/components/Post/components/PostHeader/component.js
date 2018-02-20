import React from 'react';
import { View, TouchableOpacity, Clipboard, ToastAndroid, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import * as colors from 'kitsu/constants/colors';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { isEmpty } from 'lodash';
import { kitsuConfig } from 'kitsu/config/env';
import { styles } from './styles';

export const PostHeader = ({
  post,
  avatar,
  onAvatarPress,
  name,
  time,
  onBackButtonPress,
  currentUser,
}) => {
  const user = (post && post.user);
  const isCurrentUser = (user && currentUser && user.id === currentUser.id);

  const postDateTime = moment().diff(time, 'days') < 2 ? moment(time).calendar() : `${moment(time).format('DD MMM')} at ${moment(time).format('H:MMA')}`;
  const ACTION_OPTIONS = [
    {
      onSelected: async () => {
        if (!post) return;
        await Clipboard.setString(`${kitsuConfig.kitsuUrl}/posts/${post.id}`);
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity(
            'Copied post link!',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        } else {
          alert('Copied post link!');
        }

      },
      text: 'Copy Link to Post',
    },
    // TODO: Implement post deletion
    // isCurrentUser ?
    //   {
    //     onSelected: null,
    //     text: 'Delete Post',
    //   } : {},
    {
      onSelected: null,
      text: 'Nevermind',
    },
  ];

  return (
    <View style={styles.postHeader}>
      <Layout.RowWrap alignItems="center">
        {onBackButtonPress && (
          <TouchableOpacity onPress={onBackButtonPress} style={styles.postHeaderBackButton}>
            <Icon name="ios-arrow-back" color={colors.listBackPurple} style={{ fontSize: 28 }} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onAvatarPress} style={styles.userDetailsLink}>
          <Avatar avatar={avatar} />
          <Layout.RowMain>
            <StyledText color="dark" size="xsmall" bold>{name}</StyledText>
            <StyledText color="grey" size="xxsmall" textStyle={{ marginTop: 3 }}>{postDateTime}</StyledText>
          </Layout.RowMain>
        </TouchableOpacity>

        {/* Todo KB: hook up with real action for each options */}
        <SelectMenu
          options={ACTION_OPTIONS.filter(s => !isEmpty(s))}
          onOptionSelected={(value, option) => {
            if (option.onSelected) option.onSelected();
          }}
          activeOpacity={0.8}
        >
          <Icon name="ios-more" color={colors.lightGrey} style={{ fontSize: 32, paddingVertical: 10 }} />
        </SelectMenu>
      </Layout.RowWrap>
    </View>
  );
};

PostHeader.propTypes = {
  post: PropTypes.object.isRequired,
  avatar: PropTypes.string,
  name: PropTypes.string,
  time: PropTypes.string,
  onBackButtonPress: PropTypes.func,
  onAvatarPress: PropTypes.func,
  currentUser: PropTypes.object,
};

PostHeader.defaultProps = {
  avatar: null,
  name: null,
  time: null,
  onBackButtonPress: null,
  onAvatarPress: null,
  currentUser: null,
};
