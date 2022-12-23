import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';

import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Kitsu } from 'kitsu/config/api';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';

interface ReactionsProps {
  loadingReactions?: boolean;
  reactions?: unknown[];
}

class Reactions extends PureComponent<ReactionsProps> {
  static defaultProps = {
    loadingReactions: false,
    reactions: [],
  };

  render() {
    const { loadingReactions, reactions } = this.props;

    if (loadingReactions) {
      return <SceneLoader />;
    }

    return (
      <TabContainer>
        <FlatList
          listKey="reactions"
          data={reactions}
          renderItem={({ item }) => {
            const title =
              (item.anime && item.anime.canonicalTitle) ||
              (item.manga && item.manga.canonicalTitle) ||
              '-';
            return <ReactionBox reactedMedia={title} reaction={item} />;
          }}
          ItemSeparatorComponent={() => (
            <RowSeparator size="large" transparent />
          )}
        />
      </TabContainer>
    );
  }
}

export const component = Reactions;
