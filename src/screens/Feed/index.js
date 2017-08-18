import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { fetchUserFeed } from 'kitsu/actions';

class Feed extends React.Component {
  componentDidMount() {
    console.log('test', this.props.fetchUserFeed());
  }

  render() {
    return <View />;
  }
}

export default connect(() => ({}), { fetchUserFeed })(Feed);
