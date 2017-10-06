import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { lightGrey, grey } from 'kitsu/constants/colors';
import { scenePadding, cardSize, borderWidth } from '../constants';
import AvatarHeader from './AvatarHeader';
import { StyledText } from '../parts';

const Container = glamorous.view(
  {
    padding: scenePadding,
    backgroundColor: '#FFFFFF',
  },
  ({ boxed }) => ({
    borderRadius: boxed ? 6 : 0,
    width: boxed ? cardSize.landscapeLarge.width : '100%',
    height: boxed ? cardSize.landscapeLarge.height : 'auto',
  }),
);

const Main = glamorous.view({
  marginTop: scenePadding,
});

const VoteBox = glamorous.view({
  paddingHorizontal: scenePadding / 2,
  paddingVertical: 0,
  borderRadius: 4,
  borderWidth: borderWidth.hairline,
  borderColor: lightGrey,
  flexDirection: 'row',
  alignItems: 'center',
});

const UpVoteCountBox = ({ upVotesCount }) => (
  <VoteBox>
    <Icon name="md-arrow-dropup" style={{ fontSize: 19, color: grey, marginRight: 5 }} />
    <StyledText color="grey" size="xxsmall">{upVotesCount}</StyledText>
  </VoteBox>
);

const ReactionBox = ({ boxed, reactedMedia, reaction }) => {
  const { user } = reaction;
  const timeStamp = moment(reaction.createdAt).fromNow();
  return (
    <Container boxed={boxed}>
      <AvatarHeader
        avatar={user.avatar && user.avatar.original}
        title={reactedMedia}
        subtitle={`by ${user.name} ・ ${timeStamp}`}
        sideElement={<UpVoteCountBox upVotesCount={reaction.upVotesCount} />}
      />
      <Main>
        <StyledText color="dark" size="small" numberOfLines={boxed && 3}>{reaction.reaction}</StyledText>
      </Main>
    </Container>
  );
};

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

export default ReactionBox;
