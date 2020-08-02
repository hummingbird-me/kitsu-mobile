import React, { Component } from 'react';
import { Text, FlatList, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import values from 'lodash/values';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'app/components/Checkbox';
import { getCategories } from 'app/store/anime/actions';
import { genres } from 'app/utils/genres';
import * as colors from 'app/constants/colors';
import { NavigationHeader } from 'app/components/NavigationHeader';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'app/navigation';
import { isEqual } from 'lodash';

class SearchCategory extends Component {
  static options() {
    return {
      bottomTabs: {
        visible: false,
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      selected: props.categoriesRaw || {},
    };
  }

  componentWillMount() {
    this.props.getCategories();
  }

  onSubmit = (genresArr) => {
    const { active, onPressFilterButton, componentId } = this.props;
    const selected = { ...this.state.selected };
    const query = {
      filter: { categories: genresArr.join(',') },
      sort: '-userCount',
    };
    if (onPressFilterButton) {
      onPressFilterButton(selected);
    } else {
      Navigation.push(componentId, {
        component: {
          name: Screens.SEARCH_RESULTS,
          passProps: { ...query, active },
        },
      });
    }
  }

  renderFlatList = (data) => {
    const { active, componentId } = this.props;
    return (
      <FlatList
        data={data}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            button
            key={item.key}
            style={{
              ...styles.parentItem,
              paddingLeft: 10,
            }}
            onPress={() => Navigation.push(componentId, {
              component: {
                name: Screens.SEARCH_RESULTS,
                passProps: { ...item, active },
              },
            })}
          >
            <View style={styles.itemContainer}>
              <Text style={styles.outerText}>
                {item.label}
              </Text>
              <Icon name="ios-arrow-forward" style={{ fontSize: 17, color: colors.darkGrey }} />
            </View>
          </TouchableOpacity>
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
                <View style={styles.itemContainer}>
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
                    </Text>
                  }
                  {show
                    ? <IconAwe name="minus-square-o" style={{ fontSize: 17, color: '#FFFFFF' }} />
                    : hasChild &&
                    <IconAwe name="plus-square-o" style={{ fontSize: 17, color: '#8E818C' }} />}
                </View>
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
    const { componentId } = this.props;
    const genresArr = values(this.state.selected).filter(a => a);
    const btnText = genresArr.length > 0
      ? `Filter by (${genresArr.length}) ${genresArr.length > 1 ? 'categories' : 'category'}`
      : 'Select at least one';

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
          onPress={() => this.onSubmit(genresArr)}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>{btnText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { itemKey, componentId, title, label } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <NavigationHeader
          componentId={componentId}
          title={title || label || 'Category'}
        />
        <View style={{ flex: 1 }}>
          {itemKey === 'release' && this.renderYears()}
          {itemKey === 'categories' && this.renderGenreList('level0', 0)}
        </View>
        {itemKey === 'categories' && this.renderFooter()}
      </View>
    );
  }
}

const styles = {
  outerText: {
    color: '#C7C1C6',
    fontFamily: 'OpenSans_400Regular',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  innerText: {
    color: '#FFFFFF',
    fontFamily: 'OpenSans_400Regular',
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
  const { categories, categoriesLoading } = anime;
  return { categories, categoriesLoading };
};

SearchCategory.propTypes = {
  getCategories: PropTypes.func.isRequired,
  categories: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getCategories })(SearchCategory);
