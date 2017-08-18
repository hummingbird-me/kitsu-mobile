import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import { fetchUserFeed } from '../../actions';

class Feed extends React.Component {
  componentDidMount() {
    console.log('test', this.props.fetchUserFeed());
  }

  render() {
    return <View />;
  }
}

export default connect(() => ({}), { fetchUserFeed })(Feed);
