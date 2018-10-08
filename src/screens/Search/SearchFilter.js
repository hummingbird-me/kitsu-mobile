import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import ModalSelector from 'react-native-modal-selector';
import forOwn from 'lodash/forOwn';
import isObjectLike from 'lodash/isObjectLike';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import { getStreamers } from 'kitsu/store/anime/actions';
import * as colors from 'kitsu/constants/colors';
import { NavigationHeader } from 'kitsu/components/NavigationHeader';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';

class SearchFilter extends Component {
  static options() {
    return {
      bottomTabs: {
        visible: false,
      },
    };
  }

  state = {
    ...defaultState,
  };

  componentDidMount() {
    const { data } = this.props;
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
    const { onApply } = this.props;
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
          default:
            break;
        }
      }
    });
    onApply(query, { ...this.state });
  }

  renderFooter = () => {
    const { componentId } = this.props;
    const btnText = 'Apply Filters';

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'baseline',
          backgroundColor: colors.darkPurple,
          borderTopWidth: 0,
          paddingHorizontal: 27,
          paddingVertical: 8,
        }}
      >
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => Navigation.pop(componentId)}
        >
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '500' }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, { flex: 3, backgroundColor: '#16A085', marginRight: 0 }]}
          onPress={this.onApply}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>{btnText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderItem = ({ item }) => {
    const { componentId } = this.props;
    const { key } = item;

    if (key === 'length') {
      return this.renderCustomItem('Length', 'length');
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
          <View style={{ ...styles.parentItem, ...styles.itemContainer }}>
            <Text style={styles.outerText}>
              {item.title}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Text style={{ ...styles.innerText, paddingRight: 10, alignSelf: 'center' }}>
                {this.state[key].label}
              </Text>
              <Icon name="ios-arrow-forward" style={{ fontSize: 17, color: colors.darkGrey }} />
            </View>
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
          Navigation.push(componentId, {
            component: {
              name: Screens.SEARCH_CATEGORY,
              passProps: {
                active: 'anime',
                itemKey: key,
                categoriesRaw: this.state.categoriesRaw,
                onPressFilterButton: (data) => {
                  Navigation.popTo(componentId);
                  this.setState({ categoriesRaw: data, categories: values(data).filter(a => a) });
                },
              },
            },
          })
        }
      >
        <View style={styles.itemContainer}>
          <Text style={styles.outerText}>
            {item.title}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ ...styles.innerText, paddingRight: 10, alignSelf: 'center' }}>
              {categories.length === 1 ? first : all}
            </Text>
            <Icon name="ios-arrow-forward" style={{ fontSize: 17, color: colors.darkGrey }} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderCustomItem = (header, param) => {
    const { componentId } = this.props;
    return (
      <TouchableOpacity
        button
        style={styles.parentItem}
        onPress={() =>
          Navigation.push(componentId, {
            component: {
              name: Screens.SEARCH_FILTER_SUB,
              passProps: {
                active: 'anime',
                title: header,
                filterKey: param,
                lengthRaw: this.state.lengthRaw,
                onPressFilterButton: (data) => {
                  Navigation.popTo(componentId);
                  this.setState({ [param]: data });
                  this.setState({ [`${param}Raw`]: data });
                },
              },
            },
          })
        }
      >
        <View style={styles.itemContainer}>
          <Text style={styles.outerText}>
            {header}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...styles.innerText, paddingRight: 10, alignSelf: 'center' }}>
              {this.state[param].label}
            </Text>
            <Icon name="ios-arrow-forward" style={{ fontSize: 17, color: colors.darkGrey }} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderSectionHeader = () => (
    <Text style={{ fontSize: 10, color: '#887985', marginBottom: 10, marginTop: 20 }}>
      Browse By
    </Text>
  );

  render() {
    const data = [
      { key: 'release', title: 'Year' },
      { key: 'categories', title: 'Category' },
      { key: 'released', title: 'Released' },
      { key: 'length', title: 'Length' },
      { key: 'avail', title: 'Availability' },
    ];
    return (
      <View style={{ flex: 1 }}>
        <NavigationHeader
          componentId={this.props.componentId}
          title="Filters"
          leftIcon={null}
          leftAction={null}
        />
        <ScrollView style={{ flex: 1, backgroundColor: colors.darkPurple }}>
          <View style={{ flex: 1, padding: 20, paddingTop: 0 }}>
            {this.renderCustomItem('Sort By', 'sort')}
            <FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              scrollEnabled={false}
              data={data}
              ListHeaderComponent={this.renderSectionHeader}
              renderItem={this.renderItem}
              keyExtractor={d => d.key}
            />
            <TouchableOpacity
              button
              style={styles.parentItem}
              onPress={() => this.setState(defaultState)}
            >
              <Text style={{ ...styles.outerText, color: 'rgba(255,183,88,0.7)' }}>
                Reset Filters
              </Text>
            </TouchableOpacity>
          </View>
          {this.renderFooter()}
        </ScrollView>
      </View>
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
    alignItems: 'center',
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
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerButton: {
    height: 37,
    flex: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginRight: 5,
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
};

const mapStateToProps = ({ anime }) => {
  const { categories, categoriesLoading, streamers } = anime;
  return { categories, categoriesLoading, streamers };
};

SearchFilter.propTypes = {
  getStreamers: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { getStreamers })(SearchFilter);
