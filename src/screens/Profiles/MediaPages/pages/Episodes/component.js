import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import { TabHeader } from 'kitsu/screens/Profiles/components/TabHeader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';

class Episodes extends PureComponent {
  static propTypes = {
    media: PropTypes.shape({
      episodes: PropTypes.array.isRequired,
    }).isRequired,
  }

  formatData(data, numberOfItems = 20) {
    return data.sort((a, b) => a.number - b.number).slice(0, numberOfItems);
  }

  render() {
    const { media } = this.props;
    const isAnime = media.type === 'anime';
    const data = this.formatData(isAnime ? media.episodes : media.chapters);
    const prefix = isAnime ? "Episode" : "Chapter";

    return (
      <TabContainer light padded>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <MediaRow
              imageVariant="landscapeSmall"
              title={item.canonicalTitle || `${prefix} ${item.number}`}
              summary={item.synopsis || media.synopsis}
              thumbnail={{
                uri: item.thumbnail ? item.thumbnail.original : media.posterImage.large,
              }}
              summaryLines={2}
            />
          )}
          ItemSeparatorComponent={() => <RowSeparator />}
          ListHeaderComponent={() => <TabHeader title={`${prefix}s`} contentDark />}
        />
      </TabContainer>
    );
  }
}

export const component = Episodes;
