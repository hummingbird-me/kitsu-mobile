import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
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

    console.log('==> DATA', data);

    if (loading) {
      // Return loading state.
      return null;
    }

    return (
      <TabContainer>

      </TabContainer>
    );
  }
}


const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const component = connect(mapStateToProps)(Reactions);
