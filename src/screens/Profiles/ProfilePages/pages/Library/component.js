import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  SceneContainer,
} from 'kitsu/screens/Profiles/components/SceneContainer';
import { Kitsu } from 'kitsu/config/api';

class Library extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }

  state = {
    loading: true,
    data: null,
  }

  componentDidMount = async () => {
    try {
      const data = await Kitsu.findAll('libraryEntries', {
        fields: {
          anime: 'slug,posterImage,canonicalTitle,titles,synopsis,subtype,startDate,status,averageRating,popularityRank,ratingRank,episodeCount',
          users: 'id',
        },
        filter: {
          user_id: this.props.currentUser.id,
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


const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const component = connect(mapStateToProps)(Library);

