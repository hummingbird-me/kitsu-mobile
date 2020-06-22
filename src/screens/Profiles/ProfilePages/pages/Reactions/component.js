import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { SceneLoader } from 'app/components/SceneLoader';
import { TabContainer } from 'app/screens/Profiles/components/TabContainer';
import { ReactionBox } from 'app/screens/Profiles/components/ReactionBox';
import { RowSeparator } from 'app/screens/Profiles/components/RowSeparator';
import { Kitsu } from 'app/config/api';

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
