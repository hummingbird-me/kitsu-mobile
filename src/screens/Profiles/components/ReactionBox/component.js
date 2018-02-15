import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { AvatarHeader } from 'kitsu/screens/Profiles/components/AvatarHeader';
import { StyledText } from 'kitsu/components/StyledText';
import { Kitsu } from 'kitsu/config/api';
import { isIdForCurrentUser } from 'kitsu/common/utils';
import { styles } from './styles';

export class ReactionBoxComponent extends PureComponent {
  static defaultProps = {
    reaction: null,
    reactedMedia: '',
    boxed: false
  }

  state = {
    upVotesCount: this.props.reaction.upVotesCount,
    vote: null,
    hasVoted: false
  }

  componentDidMount() {
    this.checkForVote();
  }

  async checkForVote() {
    const { currentUser, reaction } = this.props;
    try {
      let vote = await Kitsu.findAll('mediaReactionVotes', {
        filter: {
          mediaReactionId: reaction.id,
          userId: currentUser.id
        },
        page: { limit: 1 }
      });
      vote = vote && vote[0];
      this.setState({ vote, hasVoted: !!vote });
    } catch (error) {
      console.log('Error checking for users vote:', error);
    }
  }

  async handleVote() {
    const { reaction, currentUser } = this.props;
    const { vote, upVotesCount, hasVoted } = this.state;
    try {
      if (hasVoted) {
        this.setState({ upVotesCount: upVotesCount - 1, hasVoted: false });
        await Kitsu.destroy('mediaReactionVotes', vote.id);
        this.setState({ vote: null });
      } else {
        this.setState({ upVotesCount: upVotesCount + 1, hasVoted: true });
        const vote = await Kitsu.create('mediaReactionVotes', {
          mediaReaction: {
            id: reaction.id
          },
          user: {
            id: currentUser.id
          }
        });
        this.setState({ vote });
      }
    } catch (error) {
      console.log('Error handling reaction vote:', error);
      this.setState({ upVotesCount, hasVoted });
    }
  }

  render() {
    const { reaction, reactedMedia, boxed, currentUser } = this.props;
    const { upVotesCount, hasVoted } = this.state;
    const { user } = reaction;
    const timeStamp = moment(reaction.createdAt).fromNow();
    // TODO: we somehow get user null which cause error ~ resulting in empty view
    // @media page. here is a temporary fix:
    // console.log('reaction box', user); // null.
    if (!user) return <View />;
    return (
      <View style={[styles.wrap, boxed && styles.wrap__boxed]}>
        <AvatarHeader
          avatar={user.avatar && user.avatar.original}
          title={reactedMedia}
          numberOfLinesTitle={(boxed && 2) || undefined}
          subtitle={`by ${user.name} ・ ${timeStamp}`}
          sideElement={
            <UpVoteCountBox
              canVote={!isIdForCurrentUser(user.id, currentUser)}
              isVotedOn={hasVoted}
              upVotesCount={upVotesCount}
              onPress={() => { this.handleVote(); }}
            />
          }
          boxed={boxed}
        />
        <View style={styles.main}>
          <StyledText color="dark" size="small" numberOfLines={(boxed && 3) || undefined}>{reaction.reaction}</StyledText>
        </View>
      </View>
    );
  }
}

export const UpVoteCountBox = ({ canVote, isVotedOn, upVotesCount, onPress }) => (
  canVote ?
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={[styles.voteBox, isVotedOn && styles.voteBox__voted]}>
      <Icon name="md-arrow-dropup" style={[styles.voteIcon, isVotedOn && styles.voteIcon__voted]} />
      <StyledText color={isVotedOn ? "light" : "grey"} size="xxsmall">{upVotesCount}</StyledText>
    </TouchableOpacity>
    :
    <View style={styles.voteBox}>
      <Icon name="md-arrow-dropup" style={styles.voteIcon} />
      <StyledText color="grey" size="xxsmall">{upVotesCount}</StyledText>
    </View>
);


UpVoteCountBox.propTypes = {
  upVotesCount: PropTypes.number,
  onPress: PropTypes.func
};

UpVoteCountBox.defaultProps = {
  upVotesCount: '',
  onPress: null
};

ReactionBoxComponent.propTypes = {
  reactedMedia: PropTypes.string,
  boxed: PropTypes.bool,
  reaction: PropTypes.object.isRequired,
};

ReactionBoxComponent.defaultProps = {
  reactedMedia: '',
  boxed: false,
  reaction: null,
};

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const ReactionBox = connect(mapStateToProps)(ReactionBoxComponent);
