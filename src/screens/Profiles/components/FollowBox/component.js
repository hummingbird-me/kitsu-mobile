import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { defaultAvatar } from 'kitsu/constants/app';
// import { SelectMenu } from 'kitsu/components/SelectMenu';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { commonStyles } from 'kitsu/common/styles';
import { Kitsu } from 'kitsu/config/api';
import { styles } from './styles';

// TODO: The functionalities will be added in future


export class FollowBox extends PureComponent {
  static propTypes = {
    onAvatarPress: PropTypes.func,
    user: PropTypes.object.isRequired,
    currentUserId: PropTypes.string,
    currentUserFollowings: PropTypes.array.isRequired,
    onHandleFollow: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onAvatarPress: null,
    currentUserId: null,
  };

  state = {
    loading: false,
  }

  ACTION_OPTIONS = [
    {
      text: `Hide Posts from ${1}`,
    },
    {
      text: `Block @${1}`,
    },
    {
      onSelected: null,
      text: 'Nevermind',
    },
  ];

  createFollow = async () => {
    if (this.state.loading) return;
    this.setState({ loading: true });

    try {
      const followItem = await Kitsu.create('follows', {
        follower: {
          id: this.props.currentUserId,
          type: 'users',
        },
        followed: {
          id: this.props.user.id,
          type: 'users',
        },
        fields: {
          users: 'id',
        },
      }, {
        include: 'followed',
      });
      this.props.onHandleFollow({ followItem, isFollowing: true });
    } catch (err) {
      console.log('Error creating follow: ', err);
    } finally {
      this.setState({ loading: false });
    }
  }

  removeFollow = async () => {
    if (this.state.loading) return;
    this.setState({ loading: true });

    try {
      const followItem = this.props.currentUserFollowings.find(
        x => x.followed.id === this.props.user.id,
      );
      await Kitsu.destroy('follows', followItem.id);
      this.props.onHandleFollow({ followItem, isFollowing: false });
    } catch (err) {
      console.log('Error removing follow: ', err);
    } finally {
      this.setState({ loading: false });
    }
  }

  renderFollowText = (text) => {
    if (this.state.loading) {
      return (<ActivityIndicator color="white" size="small" />);
    }

    return (<Text style={[commonStyles.text, commonStyles.colorWhite]}>{text}</Text>);
  }

  renderFollowButton = () => {
    const { user, currentUserFollowings } = this.props;

    if (currentUserFollowings.some(x => x.followed.id && x.followed.id === user.id)) {
      return (
        <TouchableOpacity transparent style={styles.unFollowButton} onPress={this.removeFollow}>
          {this.renderFollowText('Unfollow')}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity transparent style={styles.followButton} onPress={this.createFollow}>
        {this.renderFollowText('Follow')}
      </TouchableOpacity>
    );
  }

  render() {
    const {
      onAvatarPress,
      user,
      currentUserId,
    } = this.props;
    const { name, id, followersCount } = user;
    const avatar = (user.avatar && user.avatar.medium) || defaultAvatar;

    let followersText = '';
    if (followersCount === 1) {
      followersText = `${followersCount} follower`;
    } else if (followersCount > 1) {
      followersText = `${followersCount} followers`;
    }

    return (
      <View style={styles.followBox}>
        <Layout.RowWrap alignItems="center">
          <TouchableOpacity onPress={onAvatarPress} style={styles.userDetailsLink}>
            <Avatar size="large" avatar={avatar} />
            <Layout.RowMain>
              <StyledText color="dark" size="xsmall" bold>{name}</StyledText>
              <StyledText color="grey" size="xsmall" textStyle={{ marginTop: 3 }}>
                {followersText}
              </StyledText>
            </Layout.RowMain>
          </TouchableOpacity>
          {currentUserId !== id && this.renderFollowButton()}
          {/* TODO: Add action options button */}
          {/* <SelectMenu
            options={ACTION_OPTIONS}
            onOptionSelected={(value, option) => {
              if (option.onSelected) option.onSelected();
            }}
            activeOpacity={0.8}
          >
            <Icon name="ios-more" color={colors.lightGrey} style={styles.followBoxActions} />
          </SelectMenu> */}
        </Layout.RowWrap>
      </View>
    );
  }
}
