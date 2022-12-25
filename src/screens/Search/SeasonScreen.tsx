import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NavigationComponentProps } from 'react-native-navigation';

import { ContentList } from 'kitsu/components/ContentList';
import { NavigationHeader } from 'kitsu/components/NavigationHeader';
import * as colors from 'kitsu/constants/colors';

import { showSeasonResults } from './SearchNavigationHelper';

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.lightPurple,
  },
});

type SeasonScreenProps = NavigationComponentProps & {
  minYear: number;
  maxYear: number;
  label?: string;
};

class SeasonScreen extends PureComponent<SeasonScreenProps> {
  static defaultProps = {
    label: 'Seasons',
    minYear: 1980,
    maxYear: new Date().getFullYear() + 1,
  };

  getSeasonData(year: number) {
    const seasons = [
      {
        title: 'Winter',
        image: require('kitsu/assets/img/seasons/Winter.png'),
      },
      {
        title: 'Spring',
        image: require('kitsu/assets/img/seasons/Spring.png'),
      },
      {
        title: 'Summer',
        image: require('kitsu/assets/img/seasons/Summer.png'),
      },
      {
        title: 'Fall',
        image: require('kitsu/assets/img/seasons/Fall.png'),
      },
    ];

    return seasons.map((season) => ({
      ...season,
      onPress: () =>
        showSeasonResults(this.props.componentId, season.title, year),
    }));
  }

  render() {
    const { maxYear, minYear, componentId, label } = this.props;

    const listData: {
      title: string;
      dark: boolean;
      data: unknown;
      type: string;
      showViewAll: boolean;
    }[] = [];
    for (let i = maxYear; i >= minYear; i -= 1) {
      listData.push({
        title: `${i}`,
        dark: i % 2 === 0,
        data: this.getSeasonData(i),
        type: 'static',
        showViewAll: false,
      });
    }

    return (
      <View style={{ flex: 1 }}>
        <NavigationHeader componentId={componentId} title={label} />
        <ScrollView style={styles.scrollContainer}>
          {listData.map((listItem) => (
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

export default SeasonScreen;
