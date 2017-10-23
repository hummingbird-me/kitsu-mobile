import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  SceneContainer,
} from 'kitsu/screens/Profiles/components/SceneContainer';
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
      // Return loading state.
      return null;
    }

    return (
      <SceneContainer />
    );
  }
}

export const component = Reactions;
