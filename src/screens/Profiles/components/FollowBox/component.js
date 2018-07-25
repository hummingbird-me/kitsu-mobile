import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from 'kitsu/constants/colors';
// import { SelectMenu } from 'kitsu/components/SelectMenu';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { commonStyles } from 'kitsu/common/styles';
import { Kitsu } from 'kitsu/config/api';
import { styles } from './styles';

// TODO: The functionalities will be added in future


export class FollowBox extends PureComponent {
  static defaultProps = {
    avatar: null,
    name: null,
    onBackButtonPress: null,
    onAvatarPress: null,
    followersCount: 0,
    userId: null,
    currentUserId: null,
    currentUserFollowings: [],
    followId: null,
  };

  state = {
    currentUserFollowings: this.props.currentUserFollowings,
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
    try {
      const record = await Kitsu.create('follows', {
        follower: {
          id: this.props.currentUserId,
          type: 'users',
        },
        followed: {
          id: this.props.userId,
          type: 'users',
        },
        include: 'followed',
      });
      console.log(record.followed);
      this.setState(prevState => ({
        currentUserFollowings: [...prevState.currentUserFollowings, { id: this.props.userId }],
      }));
    } catch (err) {
      console.log('Error creating follow: ', err);
    }
  }

  removeFollow = async () => {
    try {
      const record = await Kitsu.destroy('follows', this.props.followId);
      console.log(record);
      this.setState({
        currentUserFollowings:
          this.state.currentUserFollowings.filter(x => x.id !== this.props.userId),
      });
    } catch (err) {
      console.log('Error removing follow: ', err);
    }
  }

  renderFollowButton = () => {
    const { userId } = this.props;
    const { currentUserFollowings } = this.state;

    if (currentUserFollowings.some(x => x.id && x.id === userId)) {
      return (
        <TouchableOpacity transparent style={styles.unFollowButton} onPress={this.removeFollow}>
          <Text style={[commonStyles.text, commonStyles.colorWhite]}>Unfollow</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity transparent style={styles.followButton} onPress={this.createFollow}>
        <Text style={[commonStyles.text, commonStyles.colorWhite]}>Follow</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      avatar,
      name,
      onBackButtonPress,
      onAvatarPress,
      followersCount,
      userId,
      currentUserId,
    } = this.props;

    let followersText = '';
    if (followersCount === 1) {
      followersText = `${followersCount} follower`;
    } else if (followersCount > 1) {
      followersText = `${followersCount} followers`;
    }

    return (
      <View style={styles.followBox}>
        <Layout.RowWrap alignItems="center">
          {onBackButtonPress && (
            <TouchableOpacity onPress={onBackButtonPress} style={styles.followBoxBackButton}>
              <Icon name="ios-arrow-back" color={colors.listBackPurple} style={{ fontSize: 28 }} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onAvatarPress} style={styles.userDetailsLink}>
            <Avatar size="large" avatar={avatar} />
            <Layout.RowMain>
              <StyledText color="dark" size="xsmall" bold>{name}</StyledText>
              <StyledText color="grey" size="xsmall" textStyle={{ marginTop: 3 }}>
                {followersText}
              </StyledText>
            </Layout.RowMain>
          </TouchableOpacity>
          {currentUserId !== userId && this.renderFollowButton()}
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

FollowBox.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  onBackButtonPress: PropTypes.func,
  onAvatarPress: PropTypes.func,
  followersCount: PropTypes.number,
  userId: PropTypes.string,
  currentUserId: PropTypes.string,
  currentUserFollowings: PropTypes.array,
  followId: PropTypes.string,
};
