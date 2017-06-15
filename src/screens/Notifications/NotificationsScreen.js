import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Spinner, Button, Container, Content, Icon } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from '../../constants/colors';

class NotificationsScreen extends Component {
  static navigationOptions = {
    title: 'Notifications',
    headerStyle: {
      backgroundColor: colors.darkPurple,
      shadowOpacity: 0,
      height: 50,
    },
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-search" android="md-search" style={{ fontSize: 24, color: tintColor }} />
    ),
  };
  constructor(props) {
    super(props);
  }

  renderItem({ item }) {
    return (
      <View>
        <Text>{item.label}</Text>
      </View>
    );
  }

  render() {
    return (
      <Container>
        <Content>
          <FlatList
            removeClippedSubviews={false}
            data={[
              { key: 1, label: 'aaa' },
              { key: 2, label: 'bbb' },
              { key: 3, label: 'ccc' },
              { key: 4, label: 'ddd' },
            ]}
            renderItem={this.renderItem}
          />
        </Content>
      </Container>
    );
  }
}

export default NotificationsScreen;
