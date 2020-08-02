import React, { PureComponent } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ContentList } from 'app/components/ContentList';
import PropTypes from 'prop-types';
import * as colors from 'app/constants/colors';
import { NavigationHeader } from 'app/components/NavigationHeader';
import { showSeasonResults } from './SearchNavigationHelper';

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.lightPurple,
  },
});

class SeasonScreen extends PureComponent {
  getSeasonData(year) {
    const seasons = [
      {
        title: 'Winter',
        image: require('app/assets/img/seasons/Winter.png'),
      },
      {
        title: 'Spring',
        image: require('app/assets/img/seasons/Spring.png'),
      },
      {
        title: 'Summer',
        image: require('app/assets/img/seasons/Summer.png'),
      },
      {
        title: 'Fall',
        image: require('app/assets/img/seasons/Fall.png'),
      },
    ];

    const data = [];
    seasons.forEach((season) => {
      data.push({
        ...season,
        onPress: () => { showSeasonResults(this.props.componentId, season.title, year); },
      });
    });

    return data;
  }

  render() {
    const { maxYear, minYear, componentId, label } = this.props;

    const listData = [];
    for (let i = maxYear; i >= minYear; i -= 1) {
      listData.push({
        title: `${i}`,
        dark: (i % 2) === 0,
        data: this.getSeasonData(i),
        type: 'static',
        showViewAll: false,
      });
    }

    return (
      <View style={{ flex: 1 }}>
        <NavigationHeader
          componentId={componentId}
          title={label}
        />
        <ScrollView style={styles.scrollContainer}>
          {listData.map(listItem => (
            <ContentList
              {...listItem}
              key={listItem.title}
              componentId={componentId}
              onPress={() => console.log('Pressed')}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

SeasonScreen.propTypes = {
  minYear: PropTypes.number,
  maxYear: PropTypes.number,
  label: PropTypes.string,
};

SeasonScreen.defaultProps = {
  label: 'Seasons',
  minYear: 1980,
  maxYear: new Date().getFullYear() + 1,
};

export default SeasonScreen;
