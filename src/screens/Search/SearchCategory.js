import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, Button, Container, Content, Icon, Segment } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from '../../constants/colors';

class SearchCategory extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.label,
    headerLeft: (
      <Button transparent color="white" onPress={() => navigation.goBack()}>
        <Icon name="md-arrow-back" style={{ color: 'white' }} />
      </Button>
    ),
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-search" android="md-search" style={{ fontSize: 24, color: tintColor }} />
    ),
  });
  componentDidMount() {
    console.log(this.props);
  }
  render() {
    const { profile, navigation, loading } = this.props;
    return (
      <Container>
        <Content>
          <Text>Search SearchCategory</Text>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { loading, profile } = user;
  return { loading, profile };
};

SearchCategory.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SearchCategory);
