import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ContentList } from 'kitsu/components/ContentList';
import PropTypes from 'prop-types';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as colors from 'kitsu/constants/colors';

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
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.label,
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <FontAwesomeIcon name="chevron-left" style={{ color: 'white' }} />
      </TouchableOpacity>
    ),
  });

  getSeasonData(year) {
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

    const data = [];
    seasons.forEach((season) => {
      data.push({
        ...season,
        onPress: () => { this.handleSeasonPress(season, year); },
      });
    });

    return data;
  }

  handleSeasonPress(season, year) {
    // TODO: Hookup search page by season here
    console.log(`${season.title} ${year}`);
  }

  render() {
    const { maxYear, minYear, navigation: { navigate } } = this.props;

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
      <ScrollView style={styles.scrollContainer}>
        {listData.map(listItem => (
          <ContentList
            {...listItem}
            key={listItem.title}
            navigate={navigate}
            onPress={() => console.log('Pressed')}
          />
        ))}
      </ScrollView>
    );
  }
}

SeasonScreen.propTypes = {
  minYear: PropTypes.number,
  maxYear: PropTypes.number,
  navigation: PropTypes.object.isRequired,
};

SeasonScreen.defaultProps = {
  minYear: 1980,
  maxYear: new Date().getFullYear() + 1,
};

export default SeasonScreen;
