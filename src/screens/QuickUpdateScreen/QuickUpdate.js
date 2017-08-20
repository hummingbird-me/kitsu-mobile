import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';

import { Kitsu } from 'kitsu/config/api';

import QuickUpdateCard from './QuickUpdateCard';
import styles from './styles';


class QuickUpdate extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
  };

  state = {
    library: null,
  }

  componentWillMount = async () => {
    const ANIME_FIELDS = [
      'slug',
      'posterImage',
      'canonicalTitle',
      'titles',
      'synopsis',
      'status',
    ];

    const USER_FIELDS = [
      'id',
    ];

    const INCLUDE = [
      'anime',
      'user',
      'mediaReaction',
    ];

    try {
      const library = await Kitsu.findAll('libraryEntries', {
        'fields[anime]': ANIME_FIELDS.join(),
        'fields[user]': USER_FIELDS.join(),
        // 'filter[status]': 'current',
        'filter[user_id]': this.props.currentUser.id,
        'filter[kind]': 'anime',
        include: INCLUDE.join(),
        'page[offset]': 0,
        'page[limit]': 40,
        sort: 'status,-progressed_at',
      });

      this.setState({ library });
    } catch (e) {
      console.log(e);
    }
  }

  getItemLayout = (data, index) => {
    const { width } = Dimensions.get('window');

    return {
      length: width / 5,
      offset: (width / 5) * index,
      index,
    };
  }

  renderItem = data => <QuickUpdateCard data={data} />;

  render() {
    const { library } = this.state;

    if (!library) {
      return null;
    }

    return (
      <View style={styles.wrapper}>
        {/* Header */}
        <View style={styles.header} />
        <Carousel
          data={library}
          renderItem={this.renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width * 0.85}
          itemHeight={900}
          style={styles.carousel}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};


export default connect(mapStateToProps)(QuickUpdate);

