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
    userId: PropTypes.number.isRequired,
  }

  state = {
    loading: true,
    data: null,
  }

  componentDidMount = async () => {
    const { userId } = this.props;

    try {
      const data = await Kitsu.findAll('mediaReactions', {
        filter: { userId },
        include: 'anime,user,manga',
        sort: 'upVotesCount',
      });

      this.setState({
        data,
        loading: false,
      });
    } catch (err) {
      console.log('Unhandled error while retrieving reactions: ', err);
    }
  }

  render() {
    const { loading, data } = this.state;

    if (loading) {
      return <SceneLoader />;
    }

    return (
      <TabContainer>
        <FlatList
          listKey="reactions"
          data={data}
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
