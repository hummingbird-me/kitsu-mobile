import React from 'react';
import {
  View,
  StyleSheet,
  Slider,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { Kitsu } from 'kitsu/config/api';
import * as colors from 'kitsu/constants/colors';
import { styles as commonStyles } from '../common/styles';
import { styles } from './styles';

const SimpleRating = ({ disabled, onRate, selected }) => (
  <View style={styles.ratingRow}>
    <TouchableOpacity onPress={() => onRate('awful')} disabled={disabled}>
      <View
        style={[
          styles.imageSimpleShadow,
          selected && selected !== 'awful' && styles.imageSimpleShadowBackground,
        ]}
      />
      <Image source={require('kitsu/assets/img/ratings/awful.png')} style={styles.imageSimple} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onRate('meh')} disabled={disabled}>
      <View
        style={[
          styles.imageSimpleShadow,
          selected && selected !== 'meh' && styles.imageSimpleShadowBackground,
        ]}
      />
      <Image source={require('kitsu/assets/img/ratings/meh.png')} style={styles.imageSimple} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onRate('good')} disabled={disabled}>
      <View
        style={[
          styles.imageSimpleShadow,
          selected && selected !== 'good' && styles.imageSimpleShadowBackground,
        ]}
      />
      <Image source={require('kitsu/assets/img/ratings/good.png')} style={styles.imageSimple} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => onRate('great')} disabled={disabled}>
      <View
        style={[
          styles.imageSimpleShadow,
          selected && selected !== 'great' && styles.imageSimpleShadowBackground,
        ]}
      />
      <Image source={require('kitsu/assets/img/ratings/great.png')} style={styles.imageSimple} />
    </TouchableOpacity>
  </View>
);

const StarRating = ({ ratingTwenty, ratingSystem, sliderValueChanged }) => (
  <View>
    {/* Star, 4.5 */
      ratingTwenty ? (
        <View style={styles.modalStarRow}>
          <Icon name="star" size={46} color={colors.yellow} />
          <Text style={styles.modalRatingText}>
            {getRatingTwentyProperties(ratingTwenty, ratingSystem).text}
          </Text>
        </View>
      ) : (
        <View style={styles.modalStarRow}>
          <Text style={styles.modalNoRatingText}>Slide to rate</Text>
        </View>
      )}
    {/* Slider */}
    <Slider
      minimumValue={0}
      maximumValue={20}
      step={ratingSystem === 'regular' ? 2 : 1}
      value={ratingTwenty}
      minimumTrackTintColor={colors.tabRed}
      maximumTrackTintColor={'rgb(43, 33, 32)'}
      onValueChange={sliderValueChanged}
      style={styles.modalSlider}
    />
  </View>
);

class RateScreen extends React.Component {
  static navigationOptions = {
    backEnabled: true,
  };

  state = {
    currentIndex: 0,
    topAnime: [],
    ratingTwenty: 0,
    ratedCount: 0,
    selected: null,
  };

  componentWillMount() {
    this.updateHeaderButton();
  }

  componentDidMount() {
    this.fetchTrendingMedia();
  }

  onSwipe = (index) => {
    const { currentIndex, topAnime, ratingTwenty, selected } = this.state;
    let ratedCount = this.state.ratedCount;
    const animes = topAnime.slice();
    animes[currentIndex].rating = ratingTwenty;
    if (ratingTwenty || selected) {
      ratedCount += 1;
      this.updateHeaderButton(ratedCount);
    }
    this.setState({ currentIndex: index, ratingTwenty: 0, ratedCount, selected: null });
  };

  onRateSimple = (rating) => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (this.state.selected === rating) {
      this.setState({ selected: null });
    } else {
      this.setState({ selected: rating });
    }
  };

  onDone = () => {
    const navigateTabs = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
    });
    this.props.navigation.dispatch(navigateTabs);
  };

  updateHeaderButton = (ratedCount = 0) => {
    const target = 5 - ratedCount;
    this.props.navigation.setParams({
      buttonRightText: target > 0 ? `Rate ${target}` : "I'm done",
      buttonRightEnabled: !(target > 0),
      buttonRightOnPress: target > 0 ? () => {} : this.onDone,
    });
  };

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

  sliderValueChanged = (ratingTwenty) => {
    const { ratingSystem } = this.props;
    if (ratingTwenty > 0.5) {
      this.setState({ ratingTwenty });
    } else {
      this.setState({ ratingTwenty: 0 });
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
    const { ratingSystem } = this.props;
    const { topAnime, currentIndex, ratingTwenty, selected } = this.state;
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
            onSnapToItem={this.onSwipe}
          />
        </View>
        {ratingSystem === 'simple' ? (
          <SimpleRating onRate={this.onRateSimple} disabled={false} selected={selected} />
        ) : (
          <StarRating
            sliderValueChanged={this.sliderValueChanged}
            ratingTwenty={ratingTwenty}
            ratingSystem={ratingSystem}
          />
        )}
        <View style={styles.buttonWatchlistWrapper}>
          <TouchableOpacity style={styles.buttonWatchlist}>
            <Text style={styles.buttonWatchlistTitle}>Want to watch</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function displayRatingFromTwenty(ratingTwenty, type) {
  if (type === 'regular') {
    return Math.round(ratingTwenty / 2) / 2;
  } else if (type === 'advanced') {
    return ratingTwenty / 2;
  } else if (type === 'simple') {
    return ratingTwenty;
  }

  throw new Error(`Unknown rating type ${type}.`);
}

function getRatingTwentyProperties(ratingTwenty, type) {
  const ratingProperties = {};
  const rating = displayRatingFromTwenty(ratingTwenty, type);

  switch (type) {
    case 'advanced':
      ratingProperties.text = rating >= 10 ? rating : rating.toFixed(1);
      ratingProperties.textStyle = styles.textStar;
      break;
    case 'regular':
      ratingProperties.text = rating >= 5 ? rating : rating.toFixed(1);
      ratingProperties.textStyle = styles.textStar;
      break;
    case 'simple':
    default:
      if (rating < 6) {
        ratingProperties.text = 'AWFUL';
        ratingProperties.textStyle = styles.textAwful;
      } else if (rating < 10) {
        ratingProperties.text = 'MEH';
        ratingProperties.textStyle = styles.textMeh;
      } else if (rating < 16) {
        ratingProperties.text = 'GOOD';
        ratingProperties.textStyle = styles.textGood;
      } else {
        ratingProperties.text = 'GREAT';
        ratingProperties.textStyle = styles.textGreat;
      }
      break;
  }

  return ratingProperties;
}

const mapStateToProps = ({ user }) => {
  const { loading, error, currentUser } = user;
  const { ratingSystem } = currentUser;
  return { loading, error, ratingSystem };
};
export default connect(mapStateToProps, null)(RateScreen);
