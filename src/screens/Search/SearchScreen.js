import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Icon,
  Item,
  Input,
  List,
  ListItem,
  Body,
  Right,
  Segment,
  Button,
  Text,
  StyleProvider,
} from 'native-base';
import PropTypes from 'prop-types';

import * as colors from '../../constants/colors';
import getTheme from '../../../native-base-theme/components';
import kitsuStyles from '../../../native-base-theme/variables/kitsu';

const list = [
  { label: 'Release date', id: 'release' },
  { label: 'Genre', id: 'genre' },
  { label: 'Service', id: 'service' },
  { label: 'Highest rated', id: 'highestRated' },
  { label: 'Most anticipated', id: 'anticipated' },
  { label: 'Upcoming', id: 'upcoming' },
];

class SearchScreen extends Component {
  static navigationOptions = {
    title: 'Search',
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

    this.state = {
      active: 'anime',
    };

    this.renderList = this.renderList.bind(this);
  }

  renderList() {
    const items = list.map(item => (
      <ListItem
        button
        style={{ height: 35 }}
        onPress={() => this.props.navigation.navigate('SearchCategory', item)}
      >
        <Body>
          <Text
            style={{
              color: colors.darkGrey,
              fontFamily: 'OpenSans',
              fontSize: 13,
              lineHeight: 18,
              fontWeight: '600',
            }}
          >
            {item.label}
          </Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    ));
    return (
      <List>
        {items}
      </List>
    );
  }
  render() {
    const { navigation } = this.props;
    const { active } = this.state;
    return (
      <Container>
        <StyleProvider style={getTheme(kitsuStyles)}>
          <Segment
            style={{
              backgroundColor: colors.darkPurple,
              borderTopWidth: 0,
              height: 44,
              shadowColor: 'black',
              shadowOpacity: 0.1,
              shadowRadius: StyleSheet.hairlineWidth,
            }}
          >
            <Button
              style={{ height: 28, marginTop: 0 }}
              active={active === 'anime'}
              onPress={() => this.setState({ active: 'anime' })}
              first
            >
              <Text>Anime</Text>
            </Button>
            <Button
              style={{ height: 28, marginTop: 0 }}
              onPress={() => this.setState({ active: 'manga' })}
              active={active === 'manga'}
            >
              <Text>Manga</Text>
            </Button>
            <Button
              style={{ height: 28, marginTop: 0 }}
              onPress={() => this.setState({ active: 'user' })}
              active={active === 'user'}
              last
            >
              <Text>Users</Text>
            </Button>
          </Segment>
        </StyleProvider>
        <Content style={{ backgroundColor: '#FAFAFA' }}>
          <Item
            style={{ height: 46, backgroundColor: '#FAFAFA', paddingLeft: 14, paddingRight: 14 }}
          >
            <Icon name="ios-search" style={{ color: '#9D9D9D' }} />
            <Input
              placeholder="Find anime, manga, users"
              style={{
                fontSize: 13,
                fontFamily: 'OpenSans',
                fontWeight: '600',
                color: colors.placeholderGrey,
                marginTop: -5,
              }}
              placeholderTextColor={colors.placeholderGrey}
            />
          </Item>
          <View style={{ padding: 17, marginTop: 17 }}>
            <Text
              style={{
                color: colors.lightGrey,
                fontSize: 10,
                fontFamily: 'OpenSans',
                fontWeight: '600',
              }}
            >
              BROWSE BY
            </Text>
          </View>
          {this.renderList()}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { loading, profile } = user;
  return { loading, profile };
};

const customTheme = {};

SearchScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SearchScreen);
