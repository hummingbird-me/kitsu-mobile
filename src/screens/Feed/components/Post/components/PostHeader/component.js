import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import * as colors from 'kitsu/constants/colors';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { styles } from './styles';

export const PostHeader = ({ avatar, onAvatarPress, name, time, onBackButtonPress }) => {
  const postDateTime = moment().diff(time, 'days') < 2 ? moment(time).calendar() : `${moment(time).format('DD MMM')} at ${moment(time).format('H:MMA')}`;
  const ACTION_OPTIONS = ['Copy link to post', 'Follow post', `Hide post from ${name}`, 'Report Post', `Block ${name}`, 'Never mind'];
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
          options={ACTION_OPTIONS}
          onOptionSelected={() => { }}
          activeOpacity={0.8}
        >
          <Icon name="ios-more" color={colors.lightGrey} style={{ fontSize: 32, paddingVertical: 10 }} />
        </SelectMenu>
      </Layout.RowWrap>
    </View>
  );
};

PostHeader.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  time: PropTypes.string,
  onBackButtonPress: PropTypes.func,
  onAvatarPress: PropTypes.func,
};

PostHeader.defaultProps = {
  avatar: null,
  name: null,
  time: null,
  onBackButtonPress: null,
  onAvatarPress: null,
};
