import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { SectionHeader } from 'kitsu/screens/Profiles/components/SectionHeader';
import { styles } from './styles';
import { InfoRow } from 'kitsu/screens/Profiles/components/InfoRow';
import { StyledText } from 'kitsu/components/StyledText';
import { isNull, isEmpty } from 'lodash';
import moment from 'moment';

const STATUS_MAP = {
  anime: {
    current: "Currently Airing",
    finished: "Finished",
    upcoming: "Upcoming",
    unreleased: "Unreleased",
    tba: "TBA",
  },
  manga: {
    current: "Publishing",
    finished: "Finished",
    upcoming: "Upcoming",
    unreleased: "Unreleased",
    tba: "TBA",
  },
};

const TITLE_MAP = {
  en: 'English',
  en_us: 'English',
  en_jp: 'Romanized',
  ja_jp: 'Japanese',
  en_cn: 'Romanized',
  zh_cn: 'Chinese',
  en_th: 'Romanized',
  th_th: 'Thai',
  en_kr: 'Romanized',
  ko_kr: 'Korean',
};

export class MediaDetails extends Component {
  static propTypes = {
    media: PropTypes.object.isRequired,
  };

  static defaultProps = {
    media: null,
  };

  state = {
    isViewingMore: false,
  };

  constructor(props) {
    super(props);
    this.isAnime = props.media.type === 'anime';
  }

  /**
   * Don't re-render when `media` updates as we have all relevant information
   * on the initial request.
   */
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.isViewingMore !== this.state.isViewingMore;
  }

  getStudios = () => {
    const { media: { animeProductions } } = this.props;
    let productions = animeProductions || [];
    productions = productions.filter(item => item.role === 'studio');
    return productions.length > 0 ?
      productions
        .map(item => item.producer && item.producer.name)
        .join(', ')
      : 'TBD';
  };

  getUnitCount = () => (
    this.isAnime ? this.props.media.episodeCount : this.props.media.chapterCount
  );

  getUnitLength = () => {
    if (!this.isAnime) { return null; }
    const count = this.getUnitCount();
    if (!count || isNull(this.props.media.episodeLength)) { return null; }
    return count > 1 ? ` (${this.props.media.episodeLength} minutes each)` :
      ` (${this.props.media.episodeLength} minutes)`;
  };

  getSeason = date => {
    const month = date.month() + 1;
    let season = '';
    if ([12, 1, 2].includes(month)) {
      season = 'Winter';
    } else if ([3, 4, 5].includes(month)) {
      season = 'Spring';
    } else if ([6, 7, 8].includes(month)) {
      season = 'Summer';
    } else if ([9, 10, 11].includes(month)) {
      season = 'Fall';
    }
    let year = date.year();
    // December is considered Winter of the next year
    if (season === 'Winter' && month === 12) {
      year = year + 1;
    }
    return `${season} ${year}`;
  };

  getStartDate = () => {
    const date = moment(this.props.media.startDate);
    const season = this.getSeason(date);
    const formattedDate = date.format('MMM D');
    return `${formattedDate}, ${season}`;
  };

  getAgeRating = () => (
    isNull(this.props.media.ageRatingGuide) ?
      this.props.media.ageRating
      : `${this.props.media.ageRating} - ${this.props.media.ageRatingGuide}`
  );

  getMediaTitles = () => {
    const { media: { titles } } = this.props;
    const map = [];
    Object.keys(titles).forEach(key => {
      map.push({ key: TITLE_MAP[key], value: titles[key] });
    });
    return map;
  };

  onViewMore = () => {
    const isViewingMore = !this.state.isViewingMore;
    this.setState({ isViewingMore });
  };

  render() {
    const { media } = this.props;
    const { isViewingMore } = this.state;

    if (isNull(media)) {
      return null;
    }

    return (
      <View style={styles.container}>
        <SectionHeader contentDark title="Details" />
        {/* Studios (Anime-only at this time) */}
        {this.isAnime && <DetailComponent label="Studios" content={this.getStudios()} />}
        {/* Episodes/Chapters */}
        <DetailComponent
          label={this.isAnime ? "Episodes" : "Chapters"}
          content={this.getUnitCount() || 'TBD'}
          details={this.getUnitLength()}
        />
        {/* Status */}
        <DetailComponent label="Status" content={STATUS_MAP[media.type][media.status]} />
        {/* Premiered */}
        {!isNull(media.startDate) && <DetailComponent label="Premiered" content={this.getStartDate()} />}
        {/* Age Rating */}
        {!isNull(media.ageRating) && <DetailComponent label="Age Rating" content={this.getAgeRating()} />}

        {/* View More */}
        {isViewingMore && (
          <View>
            {this.getMediaTitles().map(item => (
              <DetailComponent label={item.key} content={item.value} />
            ))}
            {!isNull(media.abbreviatedTitles) && media.abbreviatedTitles.length > 0 && (
              <DetailComponent label="Synonyms" content={media.abbreviatedTitles.join(', ')} />
            )}
          </View>
        )}
        <TouchableOpacity style={styles.viewMoreContainer} onPress={this.onViewMore}>
          <StyledText size="xxsmall" color="grey">
            {isViewingMore ? "View Less" : "View More"}
          </StyledText>
        </TouchableOpacity>
      </View>
    );
  }
}

const DetailComponent = ({ label, content, details }) => (
  <View style={styles.detailRow}>
    <StyledText textStyle={styles.detailLabel} size="xxsmall" color="grey" bold>{label}</StyledText>
    <StyledText textStyle={isEmpty(details) ? styles.detailContent : {}} size="xxsmall" color="dark" bold>{content}</StyledText>
    {!isEmpty(details) && (
      <StyledText textStyle={styles.detailContent} size="xxsmall" color="grey" bold>{details}</StyledText>
    )}
  </View>
);

DetailComponent.propTypes = {
  label: PropTypes.string,
  content: PropTypes.string,
  details: PropTypes.string,
};

DetailComponent.defaultProps = {
  label: null,
  content: null,
  details: null
};
