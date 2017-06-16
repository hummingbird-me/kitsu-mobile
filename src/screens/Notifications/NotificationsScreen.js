import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import {
  Spinner,
  Button,
  Container,
  Content,
  Left,
  Right,
  Item,
  Thumbnail,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Avatar } from 'react-native-elements';
import PropTypes from 'prop-types';
import * as colors from '../../constants/colors';

class NotificationsScreen extends Component {
  static navigationOptions = {
    title: 'Notifications',
    headerStyle: {
      backgroundColor: colors.darkPurple,
      shadowOpacity: 0,
      height: 64,
    },
    tabBarIcon: ({ tintColor }) => (
      <Icon name="bell" style={{ fontSize: 24, color: tintColor }} />
    ),
  };
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity button style={{ ...styles.parentItem, padding: 5 }}>
        <View style={{ justifyContent: 'center', paddingLeft: 5, paddingRight: 10 }}>
          <Icon name="circle" style={{ fontSize: 8, color: '#FF102E' }} />
        </View>
        <View style={{ alignItems: 'center', flexDirection: 'row', flex: 1 }}>
          <View style={{ paddingRight: 10 }}>
            <Image
              style={{ width: 32, height: 32, borderRadius: 16 }}
              source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg' }}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'OpenSans', fontSize: 12, fontWeight: '600' }}>
                <Text style={{ color: '#FF300A', fontWeight: '600' }}>Naoto_is_Best_Girl</Text>
                {' '}
                and 14 others liked your post.
              </Text>
            </View>
            <View style={{ justifyContent: 'flex-start' }}>
              <Text style={{ fontSize: 10, color: '#919191' }}>7 hours ago</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Container>
        <Content style={{ backgroundColor: '#FAFAFA' }}>
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

const styles = {
  outerText: {
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  innerText: {
    color: 'black',
    fontFamily: 'OpenSans',
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '600',
  },
  parentItem: {
    height: 65,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
  },
};

export default NotificationsScreen;
