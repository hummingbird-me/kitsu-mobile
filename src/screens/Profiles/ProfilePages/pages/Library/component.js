import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Kitsu } from 'kitsu/config/api';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';

class Library extends PureComponent {
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
      const data = await Kitsu.findAll('libraryEntries', {
        fields: {
          anime: 'slug,posterImage,canonicalTitle,titles,synopsis,subtype,startDate,status,averageRating,popularityRank,ratingRank,episodeCount',
          users: 'id',
        },
        filter: {
          userId,
          kind: 'anime',
        },
        include: 'anime,user,mediaReaction',
        page: {
          // TODO: Connect pagination with flat list
          offset: 0,
          limit: 40,
        },
        sort: 'status,-progressed_at',
      });

      this.setState({
        data,
        loading: false,
      });
    } catch (err) {
      console.log('Unhandled error while retrieving library entries: ', err);
    }
  }

  render() {
    const { loading, data } = this.state;

    if (loading) {
      // Return loading state.
      return null;
    }

    return (
      <SceneContainer />
    );
  }
}

export const component = Library;
