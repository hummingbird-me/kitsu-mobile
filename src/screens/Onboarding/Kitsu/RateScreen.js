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
import { Kitsu, setToken } from 'kitsu/config/api';
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
    topMedia: [],
    currentIndex: 0,
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
    const { currentIndex, topMedia, ratingTwenty, selected } = this.state;
    let ratedCount = this.state.ratedCount;
    const updatedTopMedia = topMedia.slice();
    if (ratingTwenty) {
      updatedTopMedia[currentIndex].rating = ratingTwenty;
      ratedCount += 1;
      this.updateHeaderButton(ratedCount);
    }
    console.log(topMedia[index].ratingTwenty);
    this.setState({
      currentIndex: index,
      topMedia: updatedTopMedia,
      ratingTwenty: topMedia[index].ratingTwenty,
      ratedCount,
      selected: getSimpleTextForRatingTwenty(topMedia[index].ratingTwenty),
    });
  };

  onRateSimple = (rating) => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (this.state.selected === rating) {
      // toggle
      this.setState({ selected: null, ratingTwenty: null });
    } else {
      this.setState(
        { selected: rating, ratingTwenty: getRatingTwentyForText(rating, 'simple') },
        this.onRate,
      );
    }
  };

  onRate = async () => {
    const { ratingTwenty, currentIndex, topMedia } = this.state;
    const { accessToken, userId } = this.props;
    setToken(accessToken);

    const id = topMedia[currentIndex].id;
    const libraryEntryId = topMedia[currentIndex].libraryEntryId;
    try {
      let response = null;
      if (libraryEntryId) {
        // patch the previous rating
        response = await Kitsu.update('libraryEntries', {
          ratingTwenty,
          id: libraryEntryId,
          anime: {
            id,
          },
          user: {
            id: userId,
          },
        });
      } else {
        response = await Kitsu.create('libraryEntries', {
          status: 'completed',
          ratingTwenty,
          anime: {
            id,
          },
          user: {
            id: userId,
          },
        });
      }
      const updatedTopMedia = topMedia.slice();
      updatedTopMedia[currentIndex].libraryEntryId = response.id;
      updatedTopMedia[currentIndex].ratingTwenty = ratingTwenty;
      updatedTopMedia[currentIndex].status = 'completed';
      this.setState({
        topMedia: updatedTopMedia,
      });
    } catch (e) {
      console.log(e, 'error patching rating');
    }
  };

  onDone = () => {
    const { account, type } = this.props.navigation.state.params;
    // if Kitsu & topMedia type is anime, navigate to ManageLibrary with
    // origin flag set true to indicate the text should be for the next media, manga.
    if ((account === 'kitsu' && type === 'manga') || account === 'aozora') {
      const navigateTabs = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Tabs' })],
      });
      this.props.navigation.dispatch(navigateTabs);
    } else {
      this.props.navigation.navigate('ManageLibrary', {
        account,
        origin: true,
      });
    }
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
    const { type } = this.props.navigation.state.params;
    try {
      let topMedia = await Kitsu.findAll(type, {
        fields: {
          [type]: 'posterImage,titles',
        },
        page: {
          limit: 10,
        },
        sort: '-averageRating',
      });
      topMedia = topMedia.map(v => ({
        ...v,
        status: null,
        ratingTwenty: null,
        libraryEntryId: null,
      }));
      this.setState({
        topMedia,
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
    const { topMedia, currentIndex, ratingTwenty, selected } = this.state;
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
            data={topMedia}
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

const mapStateToProps = ({ auth, user }) => {
  const { loading, error, currentUser } = user;
  const { ratingSystem, id: userId } = currentUser;
  const { access_token: accessToken } = auth.tokens;
  return { loading, error, accessToken, userId, ratingSystem };
};

export default connect(mapStateToProps, null)(RateScreen);

function getSimpleTextForRatingTwenty(rating) {
  if (!rating) {
    return null;
  } else if (rating <= 5) {
    return 'awful';
  } else if (rating <= 9) {
    return 'meh';
  } else if (rating <= 15) {
    return 'good';
  } else if (rating <= 20) {
    return 'great';
  }
}

function getRatingTwentyForText(text, type) {
  if (type !== 'simple') {
    throw new Error('This function should only be used in simple ratings.');
  }

  switch (text) {
    case 'awful':
      return 2;
    case 'meh':
      return 8;
    case 'good':
      return 14;
    case 'great':
      return 20;
    default:
      throw new Error(`Unknown text while determining simple rating type: "${text}"`);
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
