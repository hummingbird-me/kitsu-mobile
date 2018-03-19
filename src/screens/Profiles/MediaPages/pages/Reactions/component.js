import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

import { TabHeader } from 'kitsu/screens/Profiles/components/TabHeader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';

class Reactions extends PureComponent {
  static propTypes = {
    media: PropTypes.object.isRequired,
    mediaReactions: PropTypes.array.isRequired,
  }

  renderReactionRows = () => {
    const { mediaReactions, media } = this.props;

    if (!mediaReactions) return null;

    return (
      <FlatList
        data={mediaReactions}
        renderItem={({ item }) => (
          <ReactionBox
            reactedMedia={media.canonicalTitle}
            reaction={item}
          />
        )}
        ItemSeparatorComponent={() => <RowSeparator size="medium" />}
        ListHeaderComponent={() => (
          <TabHeader
            contentDark
            title="Reactions"
            actionOnPress={() => {}}
            actionTitle=""
          />
        )}
      />
    );
  }

  render() {
    return (
      <TabContainer light>
        {this.renderReactionRows()}
      </TabContainer>
    );
  }
}

export const component = Reactions;
