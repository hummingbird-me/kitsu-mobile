import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Kitsu } from 'kitsu/config/api';
import * as colors from 'kitsu/constants/colors';
import { styles as commonStyles } from '../common/styles';
import { styles } from './styles';

const SimpleRating = ({ disabled, onRate }) => (
  <View style={styles.ratingRow}>
    <TouchableOpacity onPress={onRate('awful')} disabled={disabled}>
      <Image source={require('kitsu/assets/img/ratings/awful.png')} style={styles.imageSimple} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onRate('meh')} disabled={disabled}>
      <Image source={require('kitsu/assets/img/ratings/meh.png')} style={styles.imageSimple} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onRate('good')} disabled={disabled}>
      <Image source={require('kitsu/assets/img/ratings/good.png')} style={styles.imageSimple} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onRate('great')} disabled={disabled}>
      <Image source={require('kitsu/assets/img/ratings/great.png')} style={styles.imageSimple} />
    </TouchableOpacity>
  </View>
);

class RateScreen extends React.Component {
  state = {
    topAnime: [],
  };

  componentDidMount() {
    this.fetchTrendingMedia();
  }

  fetchTrendingMedia = async () => {
    try {
      const topAnime = await Kitsu.findAll('anime', {
        fields: {
          anime: 'posterImage,titles',
        },
        page: {
          limit: 10,
        },
        sort: '-averageRating',
      });
      console.log(topAnime);
      this.setState({
        topAnime,
      });
    } catch (e) {
      console.log(e);
    }
  };

  renderItem = ({ item }) => (
    <Image style={styles.poster} source={{ uri: item.posterImage.large }}>
      <LinearGradient colors={['transparent', 'rgb(0,0,0)']} style={styles.posterContainer}>
        <Text style={styles.showTitle}>{item.titles.en}</Text>
      </LinearGradient>
    </Image>
  );

  render() {
    const { topAnime } = this.state;
    return (
      <View style={commonStyles.container}>
        <Text style={styles.title}>Rate the anime you{"'"}ve seen</Text>
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: colors.darkGrey,
            marginVertical: 10,
          }}
        />
        <View style={{ height: 380, marginTop: 10 }}>
          <Carousel
            ref={(c) => {
              this.carousel = c;
            }}
            data={topAnime}
            renderItem={this.renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={260}
          />
        </View>
        <SimpleRating onRate={() => {}} disabled={false} />
        <View style={styles.buttonWatchlistWrapper}>
          <TouchableOpacity style={styles.buttonWatchlist}>
            <Text style={styles.buttonWatchlistTitle}>Want to watch</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { loading, error } = user;
  return { loading, error };
};
export default connect(mapStateToProps, null)(RateScreen);
