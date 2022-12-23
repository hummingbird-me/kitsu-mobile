import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';

import { TabHeader } from 'kitsu/screens/Profiles/components/TabHeader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';

interface ReactionsProps {
  media: object;
  mediaReactions: unknown[];
}

class Reactions extends PureComponent<ReactionsProps> {
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
