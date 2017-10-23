import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaReactions } from 'kitsu/store/media/actions';
import { TabHeader } from 'kitsu/screens/Profiles/components/TabHeader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';

class Reactions extends Component {
  static propTypes = {
    media: PropTypes.object.isRequired,
    reactions: PropTypes.object.isRequired,
  }

  static defaultProps = {
    media: {},
    reactions: {},
  }

  renderReactionRows = () => {
    const { reactions, media } = this.props;

    if (!reactions) return null;

    return (
      <FlatList
        data={reactions}
        renderItem={({ item }) => (
          <ReactionBox
            reactedMedia={media.canonicalTitle}
            reaction={item}
          />
        )}
        ItemSeparatorComponent={() => <RowSeparator size="large" />}
        ListHeaderComponent={() => (
          <TabHeader
            padded
            title="Reactions"
            actionOnPress={this.handleWriteReaction}
            actionTitle="Write reaction"
          />
        )}
      />
    );
  }

  render() {
    return (
      <TabContainer>
        {this.renderReactionRows()}
      </TabContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { media, reactions } = state.media;
  const mediaId = 12;
  return {
    media: media[mediaId] || {},
    reactions: reactions[mediaId] || [],
  };
};

export const component = connect(mapStateToProps, {
  fetchMedia,
  fetchMediaReactions,
})(Reactions);
