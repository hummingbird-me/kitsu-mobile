import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import { styles } from './styles';

export const CreateNewPost = ({ avatar, onPress }) => (
  <View style={styles.wrap}>
    <TouchableOpacity onPress={onPress} style={styles.touchArea}>
      <Avatar avatar={avatar} />
      <View style={styles.main}>
        <StyledText color="lightGrey" size="xsmall">Want to share an update, Josh?</StyledText>
      </View>
    </TouchableOpacity>
  </View>
);

CreateNewPost.propTypes = {
  avatar: PropTypes.string,
  onPress: PropTypes.func,
};

CreateNewPost.defaultProps = {
  avatar: null,
  onPress: null,
};
