import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { Kitsu } from 'kitsu/config/api';

class Reactions extends PureComponent {
  static propTypes = {
    loadingReactions: PropTypes.bool,
    reactions: PropTypes.array,
  }

  static defaultProps = {
    loadingReactions: false,
    reactions: [],
  }

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
              (item.manga && item.manga.canonicalTitle) || '-';
            return (
              <ReactionBox
                reactedMedia={title}
                reaction={item}
              />
            );
          }}
          ItemSeparatorComponent={() => <RowSeparator size="large" transparent />}
        />
      </TabContainer>
    );
  }
}

export const component = Reactions;
