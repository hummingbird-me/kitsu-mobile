import React from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import Avatar from './avatar';

const PostMeta = ({ author, avatar }) => (
  <View style={styles.metaContainer}>
    <Avatar source={avatar} />
    <View
      style={{
        marginLeft: 10,
        justifyContent: 'space-between',
      }}
    >
      <Text style={styles.authorText}>{author}</Text>
      <Text style={styles.feedSelector}>
        Follower Feed
        <FontAwesome name="angle-down" style={{ paddingRight: 6 }} />
      </Text>
    </View>
  </View>
);

PostMeta.propTypes = {
  author: PropTypes.string.isRequired,
  avatar: Image.propTypes.source.isRequired,
};

export default PostMeta;
