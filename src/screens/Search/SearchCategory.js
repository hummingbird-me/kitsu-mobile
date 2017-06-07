import React, { Component } from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button, Container, Content, Icon, Item, Left, Right } from 'native-base';
import PropTypes from 'prop-types';
import { genres } from '../../utils/genres';
import * as colors from '../../constants/colors';

class SearchCategory extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.label,
    headerLeft: (
      <Button transparent color="white" onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" style={{ color: 'white' }} />
      </Button>
    ),
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-search" android="md-search" style={{ fontSize: 24, color: tintColor }} />
    ),
  });
  constructor(props) {
    super(props);
    this.renderFlatList = this.renderFlatList.bind(this);
    this.renderGenres = this.renderGenres.bind(this);
    this.renderYears = this.renderYears.bind(this);
  }

  renderFlatList(data) {
    const { navigation } = this.props;
    const { active } = navigation.state.params;
    return (
      <FlatList
        data={data}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <Item
            button
            key={item.key}
            style={{
              height: 50,
              flexDirection: 'row',
              paddingLeft: 10,
              paddingRight: 10,
              borderTopWidth: StyleSheet.hairlineWidth,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: '#EEEEEE',
            }}
            onPress={() => navigation.navigate('SearchResults', { ...item, active })}
          >
            <Left>
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
            </Left>
            <Right>
              <Icon name="arrow-forward" style={{ fontSize: 17, color: colors.darkGrey }} />
            </Right>
          </Item>
        )}
      />
    );
  }

  renderGenres() {
    const genresArray = genres.map((item) => {
      const key = item.toLowerCase().replace(' ', '');
      return {
        key,
        label: item,
        filter: { genres: item },
        sort: '-userCount',
      };
    });

    return this.renderFlatList(genresArray);
  }

  renderYears() {
    const today = new Date();
    const min = 1900;
    const step = 10;
    const max = Math.ceil(today.getUTCFullYear() / step) * step;
    const years = new Array((max - min) / step).fill(step).map((item, index) => {
      const year = (index * item) + min;
      return {
        key: year,
        label: `${year}s`,
        filter: { year: `${year}..${year + step}` },
        sort: '-userCount',
      };
    });

    return this.renderFlatList(years);
  }
  render() {
    const { key } = this.props.navigation.state.params;
    return (
      <Container>
        <Content style={{ backgroundColor: '#FAFAFA' }}>
          {key === 'release' && this.renderYears()}
          {key === 'genre' && this.renderGenres()}
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
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SearchCategory);
