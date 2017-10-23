import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  SceneContainer,
} from 'kitsu/screens/Profiles/components/SceneContainer';
import { Kitsu } from 'kitsu/config/api';

class Groups extends PureComponent {
  static propTypes = {
    userId: PropTypes.number.isRequired,
  }

  state = {
    loading: true,
    data: null,
  }

  componentDidMount = async () => {
    try {
      const data = await Kitsu.findAll('group-members', {
        fields: {
          group: 'slug,name,avatar,tagline,membersCount,category',
        },
        filter: {
          query_user: this.props.userId,
        },
        include: 'group.category',
        sort: '-created_at',
      });

      this.setState({
        data,
        loading: false,
      });
    } catch (err) {
      console.log('Unhandled error while retrieving groups: ', err);
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

export const component = Groups;
