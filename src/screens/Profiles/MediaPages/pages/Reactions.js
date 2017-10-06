import React, { Component } from 'react';
import { View, SectionList } from 'react-native';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaReactions } from 'kitsu/store/media/actions';
import {
  ReactionBox,
  TabHeader,
  TabContainer,
} from '../components';

const ItemSeparator = glamorous.view({
  alignItems: 'stretch',
  height: 10,
});

class Reactions extends Component {
  handleWriteReaction = () => {
  }

  renderReactionRows = () => {
    if (!this.props.reactions) return null;
    const { media, reactions } = this.props;

    return (
      <SectionList
        sections={[
          { data: reactions },
        ]}
        renderItem={({ item }) => (
          <ReactionBox
            reactedMedia={media.canonicalTitle}
            reaction={item}
          />
        )}
        ItemSeparatorComponent={() => <ItemSeparator />}
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

Reactions.propTypes = {
  media: PropTypes.object.required,
  reactions: PropTypes.object.required,
};

Reactions.defaultProps = {
  media: {},
  reactions: {},
};

const mapStateToProps = (state) => {
  const { media, reactions } = state.media;
  const mediaId = 12;
  return {
    media: media[mediaId] || {},
    reactions: reactions[mediaId] || [],
  };
};

export default connect(mapStateToProps, {
  fetchMedia,
  fetchMediaReactions,
})(Reactions);
