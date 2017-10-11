import React, { Component } from 'react';
import { View, SectionList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaReactions } from 'kitsu/store/media/actions';
import {
  ReactionBox,
  TabHeader,
  TabContainer,
} from 'kitsu/screens/Profiles/components';
import { styles } from './styles';

class Reactions extends Component {
  static propTypes = {
    media: PropTypes.object.isRequired,
    reactions: PropTypes.object.isRequired,
  }

  static defaultProps = {
    media: {},
    reactions: {},
  }

  handleWriteReaction = () => {
  }

  renderItem = ({ item }) => {
    const { media } = this.props;

    return (
      <ReactionBox
        reactedMedia={media.canonicalTitle}
        reaction={item}
      />
    );
  }

  renderListHeader = () => (
    <TabHeader
      padded
      title="Reactions"
      actionOnPress={this.handleWriteReaction}
      actionTitle="Write reaction"
    />
  )

  renderItemSeparator = () => (
    <View style={styles.itemSeparator} />
  )

  renderReactionRows = () => {
    const { reactions } = this.props;

    if (!reactions) return null;

    return (
      <SectionList
        sections={[{ data: reactions }]}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderItemSeparator}
        ListHeaderComponent={this.renderListHeader}
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
