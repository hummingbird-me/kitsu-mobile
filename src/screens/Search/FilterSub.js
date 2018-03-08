import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, SectionList, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Button, Container, Content, Icon, Left, Right, Footer } from 'native-base';
import PropTypes from 'prop-types';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { getCategories } from 'kitsu/store/anime/actions';
import * as colors from 'kitsu/constants/colors';
import { NavigationHeader } from 'kitsu/components/NavigationHeader';

const width = Dimensions.get('screen').width - 40;

class FilterSub extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <NavigationHeader
        navigation={navigation}
        title={navigation.state.params.title || navigation.state.params.label}
      />
    ),
    gesturesEnabled: false,
    tabBarVisible: false,
  });

  state = {
    show: false,
    selected: {},
    start: 0,
    end: 100,
    startV: 0,
    endV: 100,
  };

  componentWillMount() {
    const { navigation: { state: { params } } } = this.props;
    if (params.lengthRaw) {
      const { end, start } = params.lengthRaw;
      this.setState({
        start,
        end,
        startV: start,
        endV: end,
      });
    }
  }

  onSubmit = (item) => {
    const { navigation } = this.props;
    navigation.state.params.onPressFilterButton(item);
  }

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.onSubmit({ label: item.section, ...item })}
      button
      style={styles.parentItem}
    >
      <Left>
        <Text style={styles.outerText}>
          {item.title}
        </Text>
      </Left>
    </TouchableOpacity>
  );

  renderLength = () => {
    const { start, end, startV, endV } = this.state;
    return (
      <View style={{ padding: 20, paddingTop: 40, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <Left>
            <Text style={{...styles.outerText, paddingLeft: 20}}>
              Start: {startV}
            </Text>
          </Left>
          <Right>
            <Text style={{ ...styles.outerText, paddingRight: 20 }}>
              End: {endV === 100 ? '∞' : endV}
            </Text>
          </Right>
        </View>
        <MultiSlider
          values={[start, end]}
          onValuesChange={values => this.setState({ startV: values[0], endV: values[1] })}
          onValuesChangeFinish={values =>
            this.setState({ start: values[0], end: values[1], startV: values[0], endV: values[1] })}
          step={1}
          min={0}
          max={100}
          sliderLength={width}
          selectedStyle={{
            backgroundColor: '#2EA291',
          }}
          unselectedStyle={{
            backgroundColor: '#151015',
          }}
          pressedMarkerStyle={{ backgroundColor: colors.darkPurple }}
          markerStyle={{
            height: 20,
            width: 20,
            borderRadius: 10,
            backgroundColor: colors.darkPurple,
            borderWidth: 5,
            borderColor: '#2EA291',
          }}
        />
      </View>
    );
  }

  renderSort = () => (
    <View style={{ padding: 20, paddingTop: 0 }}>
      {/* this.renderItem({ item: { title: 'Title', key: 'title' } })*/}
      <SectionList
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        sections={[
          {
            data: [
              {
                key: 'highest',
                title: 'Highest first',
                section: 'Average Rating',
                type: '-averageRating',
              },
              {
                key: 'lowest',
                title: 'Lowest first',
                section: 'Average Rating',
                type: 'averageRating',
              },
            ],
            title: 'Average Rating',
            key: 'a1',
          },
          {
            data: [
              {
                key: 'newest',
                title: 'Newest first',
                section: 'Release Date',
                type: '-startDate',
              },
              {
                key: 'earliest',
                title: 'Earliest first',
                section: 'Release Date',
                type: 'startDate',
              },
            ],
            title: 'Release Date',
            key: 'a2',
          },
          {
            data: [
              {
                key: 'shortest',
                title: 'Shortest first',
                section: 'Duration',
                type: 'episodeLength',
              },
              {
                key: 'longest',
                title: 'Longest first',
                section: 'Duration',
                type: '-episodeLength',
              },
            ],
            title: 'Duration',
            key: 'a3',
          },
          {
            data: [
              {
                key: 'most',
                title: 'Most popular first',
                section: 'Popularity',
                type: '-userCount',
              },
              {
                key: 'least',
                title: 'Least popular first',
                section: 'Popularity',
                type: 'userCount',
              },
              // { key: 'week', title: 'This week' },
              // { key: 'month', title: 'This month' },
              // { key: 'year', title: 'This year' },
            ],
            title: 'Popularity',
            key: 'a4',
          },
        ]}
      />
    </View>
  );

  renderSectionHeader = ({ section }) => (
    <Text style={{ fontSize: 10, color: '#887985', marginBottom: 10, marginTop: 12 }}>
      {section.title.toUpperCase()}
    </Text>
  );

  renderFooter = () => {
    const { navigation } = this.props;
    const btnText = 'Set';
    const { start, end } = this.state;
    let title = 'All';
    if (end < 100 || start > 0) {
      title = `${start} - ${end === 100 ? '∞' : end}`;
    }

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
          onPress={() => this.onSubmit({ label: title, start, end })}
          style={{
            height: 37,
            flex: 3,
            borderColor: 'rgba(255,255,255,0.2)',
            marginLeft: 5,
            borderRadius: 3,
            justifyContent: 'center',
            backgroundColor: '#16A085',
          }}
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
        <Content style={{ backgroundColor: colors.darkPurple }}>
          {key === 'length' ? this.renderLength() : this.renderSort()}
        </Content>
        {key === 'length' && this.renderFooter()}
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
    fontWeight: '600',
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

FilterSub.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { getCategories })(FilterSub);
