import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { AvatarHeader } from 'kitsu/screens/Profiles/components/AvatarHeader';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const ReactionBox = ({ boxed, reactedMedia, reaction }) => {
  const { user } = reaction;
  const timeStamp = moment(reaction.createdAt).fromNow();
  console.log('==> REACTION', reaction);
  return (
    <View style={[styles.wrap, boxed && styles.wrap__boxed]}>
      <AvatarHeader
        avatar={user.avatar && user.avatar.original}
        title={reactedMedia}
        subtitle={`by ${user.name} ・ ${timeStamp}`}
        sideElement={<UpVoteCountBox upVotesCount={reaction.upVotesCount} />}
      />
      <View style={styles.main}>
        <StyledText color="dark" size="small" numberOfLines={boxed && 3}>{reaction.reaction}</StyledText>
      </View>
    </View>
  );
};

export const UpVoteCountBox = ({ upVotesCount }) => (
  <View style={styles.voteBox}>
    <Icon name="md-arrow-dropup" style={styles.voteIcon} />
    <StyledText color="grey" size="xxsmall">{upVotesCount}</StyledText>
  </View>
);


UpVoteCountBox.propTypes = {
  upVotesCount: PropTypes.number,
};

UpVoteCountBox.defaultProps = {
  upVotesCount: '',
};

ReactionBox.propTypes = {
  reactedMedia: PropTypes.string,
  boxed: PropTypes.bool,
  reaction: PropTypes.object,
};

ReactionBox.defaultProps = {
  reactedMedia: '',
  boxed: false,
  reaction: {},
};
