import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { styles } from './styles';

export const CreatePostRow = ({ avatar, onPress }) => (
  <View style={styles.wrap}>
    <TouchableOpacity onPress={onPress}>
      <Layout.RowWrap alignItems="center">
        <Avatar avatar={avatar} />
        <Layout.RowMain>
          <StyledText color="grey" size="xsmall">Want to share an update, Josh?</StyledText>
        </Layout.RowMain>
      </Layout.RowWrap>
    </TouchableOpacity>
  </View>
);

CreatePostRow.propTypes = {
  avatar: PropTypes.string,
  onPress: PropTypes.func,
};

CreatePostRow.defaultProps = {
  avatar: null,
  onPress: null,
};
