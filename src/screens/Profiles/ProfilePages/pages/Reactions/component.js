import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  SceneContainer,
} from 'kitsu/screens/Profiles/components/SceneContainer';
import { Kitsu } from 'kitsu/config/api';

class Reactions extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }

  state = {
    loading: true,
    data: null,
  }

  componentDidMount = async () => {
    try {
      const data = await Kitsu.findAll('mediaReactions', {
        filter: {
          user_id: this.props.currentUser.id,
        },
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


const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const component = connect(mapStateToProps)(Reactions);
