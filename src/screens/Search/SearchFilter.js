import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, SectionList, Switch } from 'react-native';
import { connect } from 'react-redux';
import { Button, Container, Content, Icon, Left, Right, Footer } from 'native-base';
import PropTypes from 'prop-types';
import ModalSelector from 'react-native-modal-selector';
import forOwn from 'lodash/forOwn';
import isObjectLike from 'lodash/isObjectLike';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import { getStreamers } from 'kitsu/store/anime/actions';
import * as colors from 'kitsu/constants/colors';
import { NavigationHeader } from 'kitsu/components/NavigationHeader';

class SearchFilter extends Component {
  static navigationOptions = () => ({
    header: (
      <NavigationHeader
        navigation={navigation}
        title="Filters"
        leftIcon={null}
        leftAction={null}
      />
    ),
    tabBarVisible: false,
  });

  state = {
    ...defaultState,
  };

  componentDidMount() {
    const { data } = this.props.navigation.state.params;
    this.setState({ ...data }, () => {
      this.props.getStreamers();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.streamers !== this.props.streamers) {
      const streamers = nextProps.streamers.map(item => ({
        key: item.siteName,
        label: item.siteName,
      }));

      pickerData.avail = [{ key: 'All', label: 'All' }, ...streamers];
    }
  }

  onApply = () => {
    const { navigation: { state: { params: { onApply } } } } = this.props;
    const query = {
      filter: {},
      sort: {},
    };
    forOwn(this.state, (value, key) => {
      let cond = '';
      if (Boolean(value) && isObjectLike(value) && !isEmpty(value)) {
        switch (key) {
          case 'avail':
            if (value.key === 'All') break;
            query.filter = { ...query.filter, streamers: value.key };
            break;
          case 'release':
            if (value.key === 'All') break;
            query.filter = { ...query.filter, year: `${value.key}..${value.key + 10}` };
            break;
          case 'released':
            if (value.key === 'All') break;
            query.filter = { ...query.filter, status: value.key };
            break;
          case 'lengthRaw':
            if (value.end - value.start === 100) break;
            cond = value.end === 100 ? '' : value.end;
            query.filter = {
              ...query.filter,
              episodeCount: `${value.start}..${cond}`,
            };
            break;
          case 'categories':
            query.filter = {
              ...query.filter,
              categories: value.join(','),
            };
            break;
          case 'sort':
            query.sort = value.type;
            break;
          case 'fade':
            query.fade = value;
            break;
          default:
            break;
        }
      }
    });
    onApply(query, { ...this.state });
  }

  renderFooter = () => {
    const { navigation } = this.props;
    const btnText = 'Apply Filters';

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
          onPress={() => navigation.goBack(null)}
        >
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '500' }}>
            Cancel
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
            backgroundColor: '#16A085',
          }}
          onPress={this.onApply}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>{btnText}</Text>
        </Button>
      </Footer>
    );
  }

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    const { key } = item;

    if (key === 'length') {
      return this.renderCustomItem('Length', 'length');
    }

    if (key === 'fade') {
      return (
        <View button style={styles.parentItem}>
          <Left>
            <Text style={styles.outerText}>
              {item.title}
            </Text>
          </Left>
          <Right>
            <Switch
              value={this.state[key]}
              onValueChange={value => this.setState({ [key]: value })}
            />
          </Right>
        </View>
      );
    }

    if (['avail', 'release', 'released', 'watched', 'plan'].includes(key)) {
      return (
        <ModalSelector
          data={pickerData[key]}
          initValue={this.state[key].label}
          onChange={(option) => {
            this.setState({ [key]: option });
          }}
        >
          <View style={{ ...styles.parentItem, flexDirection: 'row', flex: 1 }}>
            <Left>
              <Text style={styles.outerText}>
                {item.title}
              </Text>
            </Left>
            <Right style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Text style={{ ...styles.innerText, paddingRight: 10, alignSelf: 'center' }}>
                {this.state[key].label}
              </Text>
              <Icon name="arrow-forward" style={{ fontSize: 17, color: colors.darkGrey }} />
            </Right>
          </View>
        </ModalSelector>
      );
    }
    const { categories } = this.state;
    const first = categories.length > 0 && categories[0];
    const all = categories.length > 0 ? `${first}, +${categories.length - 1}` : 'All';

    return (
      <TouchableOpacity
        button
        style={styles.parentItem}
        onPress={() =>
          navigation.navigate('FilterCategory', {
            active: 'anime',
            key,
            categories: this.state.categoriesRaw,
            onPressFilterButton: (data) => {
              navigation.goBack(null);
              this.setState({ categoriesRaw: data });
              this.setState({ categories: values(data).filter(a => a) });
            },
          })}
      >
        <Left>
          <Text style={styles.outerText}>
            {item.title}
          </Text>
        </Left>
        <Right style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={{ ...styles.innerText, paddingRight: 10, alignSelf: 'center' }}>
            {categories.length === 1 ? first : all}
          </Text>
          <Icon name="arrow-forward" style={{ fontSize: 17, color: colors.darkGrey }} />
        </Right>
      </TouchableOpacity>
    );
  }

  renderCustomItem = (header, param) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        button
        style={styles.parentItem}
        onPress={() =>
          navigation.navigate('FilterSub', {
            active: 'anime',
            title: header,
            key: param,
            lengthRaw: this.state.lengthRaw,
            onPressFilterButton: (data) => {
              navigation.goBack(null);
              this.setState({ [param]: data });
              this.setState({ [`${param}Raw`]: data });
            },
          })}
      >
        <Left>
          <Text style={styles.outerText}>
            {header}
          </Text>
        </Left>
        <Right style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={{ ...styles.innerText, paddingRight: 10, alignSelf: 'center' }}>
            {this.state[param].label}
          </Text>
          <Icon name="arrow-forward" style={{ fontSize: 17, color: colors.darkGrey }} />
        </Right>
      </TouchableOpacity>
    );
  }

  renderSectionHeader = ({ section }) => {
    return (
      <Text style={{ fontSize: 10, color: '#887985', marginBottom: 10, marginTop: 32 }}>
        {section.title.toUpperCase()}
      </Text>
    );
  }

  render() {
    return (
      <Container style={{ backgroundColor: colors.darkPurple }}>
        <Content>
          <View style={{ padding: 20, paddingTop: 0 }}>
            {this.renderCustomItem('Sort By', 'sort')}
            <SectionList
              renderSectionHeader={this.renderSectionHeader}
              renderItem={this.renderItem}
              sections={[
                {
                  data: [
                    { key: 'release', title: 'Year' },
                    { key: 'categories', title: 'Category' },
                    { key: 'released', title: 'Released' },
                    { key: 'length', title: 'Length' },
                    { key: 'avail', title: 'Availability' },
                  ],
                  title: 'Browse by',
                  key: 'a1',
                },
                // {
                //   data: [
                //     { key: 'watched', title: 'Watched' },
                //     { key: 'plan', title: 'Plan to Watch' },
                //     { key: 'fade', title: 'Fade Watched' },
                //   ],
                //   title: 'Your library',
                //   key: 'a2',
                // },
              ]}
            />
            <TouchableOpacity
              button
              style={styles.parentItem}
              onPress={() => this.setState(defaultState)}
            >
              <Left>
                <Text style={{ ...styles.outerText, color: 'rgba(255,183,88,0.7)' }}>
                  Reset Filters
                </Text>
              </Left>
            </TouchableOpacity>
          </View>
        </Content>
        {this.renderFooter()}
      </Container>
    );
  }
}

SearchFilter.propTypes = {
  streamers: PropTypes.array.isRequired,
};

const defaultState = {
  title: '',
  avail: { label: 'All', key: 'All' },
  fade: false,
  release: { label: 'All', key: 'All' },
  released: { label: 'All', key: 'All' },
  length: { label: 'All' },
  lengthRaw: { start: 0, end: 100 },
  categories: [],
  categoriesRaw: {},
  watched: { label: 'All', key: 'All' },
  plan: { label: 'All', key: 'All' },
  sort: { type: '-userCount', label: 'Popularity' },
};
const pickerData = {
  release: [
    { key: 'All', label: 'All' },
    { key: 2010, label: '2010s' },
    { key: 2000, label: '2000s' },
    { key: 1990, label: '1990s' },
    { key: 1980, label: '1980s' },
    { key: 1970, label: '1970s' },
    { key: 1960, label: '1960s' },
    { key: 1950, label: '1950s' },
    { key: 1940, label: '1940s' },
    { key: 1930, label: '1930s' },
    { key: 1920, label: '1920s' },
    { key: 1910, label: '1910s' },
    { key: 1900, label: '1900s' },
  ],
  avail: [],
  watched: [
    { key: 'All', label: 'All' },
    { key: 'Watched', label: 'Watched' },
    { key: 'Not Watched', label: 'Not Watched' },
  ],
  released: [
    { key: 'All', label: 'All' },
    { key: 'current,finished', label: 'Released' },
    { key: 'unreleased,upcoming', label: 'Unreleased' },
  ],
  plan: [
    { key: 'All', label: 'All' },
    { key: 'In Plan to Watch', label: 'In Plan to Watch' },
    { key: 'Not in Plan to Watch', label: 'Not in Plan to Watch' },
  ],
};
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
    lineHeight: 12,
    fontWeight: '600',
  },
  parentItem: {
    height: 43,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.darkPurple,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#382534',
  },
  sliderItem: {
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.darkPurple,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#382534',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
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
  const { categories, categoriesLoading, streamers } = anime;
  return { categories, categoriesLoading, streamers };
};

SearchFilter.propTypes = {
  navigation: PropTypes.object.isRequired,
  getStreamers: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getStreamers })(SearchFilter);
