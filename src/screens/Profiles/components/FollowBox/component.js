import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from 'kitsu/constants/colors';
// import { SelectMenu } from 'kitsu/components/SelectMenu';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { styles } from './styles';

export const FollowBox = ({
  avatar,
  onAvatarPress,
  name,
  onBackButtonPress,
  followersCount,
}) => {
  let followersText = '';
  if (followersCount === 1) {
    followersText = `${followersCount} follower`;
  } else if (followersCount > 1) {
    followersText = `${followersCount} followers`;
  }

  // TODO: The functionalities will be added in future
  const ACTION_OPTIONS = [
    {
      text: `Hide Posts from ${name}`,
    },
    {
      text: `Block @${name}`,
    },
    {
      onSelected: null,
      text: 'Nevermind',
    },
  ];

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
};

FollowBox.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  onBackButtonPress: PropTypes.func,
  onAvatarPress: PropTypes.func,
  followersCount: PropTypes.number,
};

FollowBox.defaultProps = {
  avatar: null,
  name: null,
  onBackButtonPress: null,
  onAvatarPress: null,
  followersCount: 0,
};
