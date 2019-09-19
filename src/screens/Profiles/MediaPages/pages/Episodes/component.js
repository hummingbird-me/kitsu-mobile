import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View, ActivityIndicator, Text } from 'react-native';
import PropTypes from 'prop-types';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { StyledText } from 'kitsu/components/StyledText';
import { isNull, padStart, isEmpty } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { lightGrey, listBackPurple } from 'kitsu/constants/colors';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';
import { styles } from './styles';

class Episodes extends PureComponent {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
    media: PropTypes.shape({
      episodes: PropTypes.array.isRequired,
    }).isRequired,
    libraryEntry: PropTypes.object,
    loadingLibrary: PropTypes.bool,
    onEpisodeProgress: PropTypes.func,
    loadingAdditional: PropTypes.bool,
  }

  static defaultProps = {
    loadingLibrary: false,
    libraryEntry: null,
    onEpisodeProgress: null,
    loadingAdditional: false,
  }

  state = {
    ascending: true,
  }

  sortData(data, ascending = true) {
    if (!data) return [];
    return data.sort((a, b) => {
      if (ascending) return a.number - b.number;
      return b.number - a.number;
    });
  }

  navigateToUnitPage = (unit) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.MEDIA_UNIT_DETAIL,
        passProps: {
          unit,
          media: this.props.media,
        },
      },
    });
  }

  renderItem = ({ item }) => {
    const { libraryEntry, media, onEpisodeProgress, loadingLibrary } = this.props;

    const numberString = !isNull(item.number) && item.number.toString();
    const paddedString = (numberString && padStart(numberString, 2, '0')) || '-';

    const prefix = media && media.type === 'anime' ? 'Episode' : 'Chapter';
    const title = item.canonicalTitle || `${prefix} ${item.number}`;

    // Check if we've completed the item
    const completed = libraryEntry && !isNull(item.number) && libraryEntry.progress >= item.number;

    return (
      <View style={styles.itemWrap}>
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => this.navigateToUnitPage(item)}
        >
          <StyledText color="black" size="small" bold textStyle={styles.itemNumber}>{paddedString}</StyledText>
          <StyledText color="black" size="small" textStyle={styles.itemTitle} numberOfLines={1}>{title}</StyledText>
          {!isEmpty(item.videos) &&
            <Icon name="ios-desktop" style={styles.watchIcon} size={18} />
          }
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onEpisodeProgress && onEpisodeProgress(item.number)}
          style={styles.progressIconContainer}
          disabled={loadingLibrary}
        >
          <View
            style={[styles.progressIconCircle, completed && styles.progressIconCircle__completed]}
          >
            {loadingLibrary && <ActivityIndicator color={lightGrey} />}
            {!loadingLibrary && completed && <Icon name="ios-checkmark" color="#FFFFFF" style={styles.progressIcon} />}
          </View>
        </TouchableOpacity>
        <Icon name="ios-arrow-forward" style={styles.arrowIcon} />
      </View>
    );
  }

  render() {
    const { media, loadingAdditional } = this.props;
    const { ascending } = this.state;

    const isAnime = media.type === 'anime';
    const data = this.sortData(isAnime ? media.episodes : media.chapters, ascending);

    return (
      <TabContainer light>
        {loadingAdditional ?
          <View style={styles.loading}>
            <ActivityIndicator color={listBackPurple} />
          </View>
          :
          <View>
            <TouchableOpacity
              onPress={() => this.setState({ ascending: !ascending })}
              style={styles.sortingContainer}
              activeOpacity={0.9}
            >
              <Text style={styles.sortingText}>{ascending ? 'Ascending' : 'Descending'}</Text>
            </TouchableOpacity>
            <FlatList
              data={data}
              renderItem={this.renderItem}
              keyExtractor={k => `${k.id}`}
              ItemSeparatorComponent={() => <RowSeparator />}
            />
          </View>
        }

      </TabContainer>
    );
  }
}

export const component = Episodes;
