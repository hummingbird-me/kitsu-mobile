import React, { Component } from 'react';
import { Text, FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Button, Container, Content, Icon, Item, Left, Right, Footer, Body } from 'native-base';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import values from 'lodash/values';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import { getCategories } from 'kitsu/store/anime/actions';
import { genres } from 'kitsu/utils/genres';
import * as colors from 'kitsu/constants/colors';
import { NavigationHeader } from 'kitsu/components/NavigationHeader';

class SearchCategory extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <NavigationHeader
        navigation={navigation}
        title={navigation.state.params.title || navigation.state.params.label || 'Category'}
      />
    ),
    tabBarVisible: false,
  });

  state = {
    show: false,
    selected: {},
  };

  componentWillMount() {
    this.props.getCategories();
    const { categories } = this.props.navigation.state.params;
    if (categories) this.setState({ selected: categories });
  }

  onSubmit = (genresArr) => {
    const { navigation } = this.props;
    const { active } = navigation.state.params;
    const selected = { ...this.state.selected };
    const query = {
      filter: { categories: genresArr.join(',') },
      sort: '-userCount',
    };
    if (navigation.state.params.onPressFilterButton) {
      navigation.state.params.onPressFilterButton(selected);
    } else {
      navigation.navigate('SearchResults', { ...query, active });
    }
  }

  renderFlatList = (data) => {
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
              ...styles.parentItem,
              paddingLeft: 10,
            }}
            onPress={() => navigation.navigate('SearchResults', { ...item, active })}
          >
            <Left>
              <Text style={styles.outerText}>
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

  renderGenreList = (id, level) => {
    const { categories, getCategories } = this.props;
    const genresArray = orderBy(values(categories[id]), ['title'], ['asc']).map(item => ({
      key: item.id,
      childCount: item.childCount,
      label: item.title,
      filter: { categories: item.title },
      sort: '-userCount',
    }));
    const itemStyle = level === 0 ? styles.parentItem : styles.childItem;
    const padding = level === 0 ? 20 : ((level - 1) * 10) + 20;
    return (
      <FlatList
        data={genresArray}
        removeClippedSubviews={false}
        renderItem={({ item }) => {
          const show = this.state[`show${item.key}`] || false;
          const hasChild = item.childCount > 0 && level < 2;
          const { selected } = this.state;
          return (
            <View>
              <TouchableOpacity
                button
                key={item.key}
                onPress={() => {
                  if (hasChild) {
                    this.setState({ [`show${item.key}`]: !show });
                    if (!categories[item.key]) getCategories(item.key, item.key);
                  } else {
                    const aaa = {
                      ...selected,
                      [item.key]: !selected[item.key] ? item.label : false,
                    };
                    this.setState({ selected: aaa });
                  }
                }}
                style={{ ...itemStyle, paddingLeft: padding }}
              >
                <Body style={{ flexDirection: 'row' }}>
                  {level !== 0 &&
                    <CheckBox
                      checked={selected[item.key] === item.label}
                      title={item.label}
                      textStyle={styles.innerText}
                      iconStyle={styles.innerText}
                      checkedIcon="check-circle"
                      uncheckedIcon="circle-thin"
                      checkedColor="#C8E6C9"
                      uncheckedColor="#8E818C"
                      containerStyle={{ backgroundColor: 'transparent', paddingRight: 0, borderWidth: 0 }}
                      onPress={() => {
                        const state = {
                          ...selected,
                          [item.key]: !selected[item.key] ? item.label : false,
                        };
                        this.setState({ selected: state });
                      }}
                    />}
                  {level === 0 &&
                    <Text style={styles.outerText}>
                      {item.label}
                    </Text>}

                </Body>
                <Right>

                  {show
                    ? <IconAwe name="minus-square-o" style={{ fontSize: 17, color: '#FFFFFF' }} />
                    : hasChild &&
                    <IconAwe name="plus-square-o" style={{ fontSize: 17, color: '#8E818C' }} />}
                </Right>
              </TouchableOpacity>
              {show && this.renderGenreList(item.key, level + 1)}
            </View>
          );
        }}
      />
    );
  }

  renderYears = () => {
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

  renderFooter = () => {
    const { navigation } = this.props;
    const genresArr = values(this.state.selected).filter(a => a);
    const btnText = genresArr.length > 0
      ? `Filter by (${genresArr.length}) ${genresArr.length > 1 ? 'categories' : 'category'}`
      : 'Select at least one';

    return (
      <Footer
        style={{
          justifyContent: 'space-around',
          alignItems: 'baseline',
          backgroundColor: colors.darkPurple,
          height: 60,
          borderTopWidth: 0,
          paddingLeft: 27,
          paddingRight: 27,
          paddingTop: 8,
        }}
      >
        <Button
          light
          bordered
          style={{
            height: 37,
            flex: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            marginRight: 5,
            borderRadius: 3,
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '500' }}>
            Back
          </Text>
        </Button>
        <Button
          style={{
            height: 37,
            flex: 3,
            borderColor: 'rgba(255,255,255,0.2)',
            marginLeft: 5,
            borderRadius: 3,
            justifyContent: 'center',
            backgroundColor: genres.length > 0 ? '#16A085' : '#7A7A7A',
          }}
          onPress={() => this.onSubmit(genresArr)}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>{btnText}</Text>
        </Button>
      </Footer>
    );
  }

  render() {
    const { key } = this.props.navigation.state.params;
    return (
      <Container>
        <Content style={{ backgroundColor: colors.listBackPurple }}>
          {key === 'release' && this.renderYears()}
          {key === 'categories' && this.renderGenreList('level0', 0)}
        </Content>
        {key === 'categories' && this.renderFooter()}
      </Container>
    );
  }
}

const styles = {
  outerText: {
    color: '#C7C1C6',
    fontFamily: 'OpenSans',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  innerText: {
    color: '#FFFFFF',
    fontFamily: 'OpenSans',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  parentItem: {
    height: 41,
    flexDirection: 'row',
    paddingRight: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.darkPurple,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#382534',
  },
  childItem: {
    height: 41,
    flexDirection: 'row',
    paddingRight: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#352834',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#2D1D29',
  },
};

const mapStateToProps = ({ anime }) => {
  const { categories, categoriesLoading } = anime;
  return { categories, categoriesLoading };
};

SearchCategory.propTypes = {
  navigation: PropTypes.object.isRequired,
  getCategories: PropTypes.func.isRequired,
  categories: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getCategories })(SearchCategory);
