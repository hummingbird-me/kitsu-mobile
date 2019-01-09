import React, { PureComponent } from 'react';
import { View, ART, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { capitalize } from 'lodash';
import { arc, pie } from 'd3-shape';
import { StyledText } from 'kitsu/components/StyledText';
import { styles, PIE_SIZE } from './styles';
import { darkPurple } from 'kitsu/constants/colors';
import moment from 'moment';
import * as imageMap from 'kitsu/assets/img/stats';

const { Surface, Group, Shape } = ART;
const COLORS = ['#FEB700', '#FF9300', '#FF3281', '#BC6EDA', '#00BBED', '#545C97', '#EA6200'];
const UNITS = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];

export class UserStats extends PureComponent {
  propTypes = {
    kind: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    isCurrentUser: PropTypes.bool,
  };

  defaultProps = {
    kind: 'anime',
    data: {},
    loading: false,
    isCurrentUser: false,
  };

  displayGenres(data) {
    const array = Object.keys(data.categories).map(key => ({ name: key, percent: data.categories[key] / data.total * 100 }));
    const sorted = array.sort(({ percent: a }, { percent: b }) => b - a).slice(0, 7);
    const filtered = sorted.filter(({ percent }) => Math.round(percent) > 0);
    return filtered.map((datum, idx) => ({
      ...datum,
      relativeSize: (datum.percent / filtered[0].percent * 100),
      color: COLORS[idx % COLORS.length],
    }));
  }

  categoryBreakdown(data) {
    const displayGenres = this.displayGenres(data);
    const radius = PIE_SIZE / 2;
    const outerArc = arc().outerRadius(radius).innerRadius(radius - 20);
    const chart = pie().sort(null).value(({ percent }) => percent);
    const primaryGenre = displayGenres[0];
    return (
      <View style={styles.graphics}>
        {/* Pie Chart */}
        <View style={styles.categoryBreakdown}>
          <Surface width={PIE_SIZE} height={PIE_SIZE}>
            {chart(displayGenres).map(arc => {
              const path = outerArc(arc);
              return (
                <Group x={radius} y={radius}>
                  <Shape d={path} fill={arc.data.color} />
                </Group>
              )
            })}
          </Surface>
          <View style={styles.categoryOverlay}>
            <StyledText bold size="xlarge" color="dark">{`${Number(primaryGenre.percent || 0).toFixed(0)}%`}</StyledText>
            <StyledText bold size="xxsmall" color="grey" numberOfLines={1}>{primaryGenre.name}</StyledText>
          </View>
        </View>
        {/* Legend */}
        <View style={styles.legendWrap}>
          {displayGenres.map(genre => (
            <View style={{ flexDirection: 'row' }}>
              <StyledText size="xsmall" textStyle={{ color: genre.color }}>{`${Number(genre.percent || 0).toFixed(0)}%`}</StyledText>
              <View style={{ flex: 1, alignSelf: 'stretch', paddingLeft: 10, paddingRight: 5 }}>
                <StyledText bold size="xsmall" color="grey" numberOfLines={1}>{genre.name}</StyledText>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ width: `${genre.relativeSize}%`, height: 6, backgroundColor: genre.color, borderRadius: 8 }} />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  primaryUnit(kind, data) {
    if (kind === 'anime') {
      const time = moment.duration(data.time, 'seconds');
      for (let i = 0; i < UNITS.length; ++i) {
        const unitTime = time.as(UNITS[i]);
        if (unitTime > 1) {
          const index = i < 4 ? 4 - i : 1;
          return { index, name: UNITS[i], count: unitTime };
        }
      }
    }
    const chapters = data.units;
    if (chapters > 15000) { return { index: 4, count: chapters }; }
    if (chapters > 5000) { return { index: 3, count: chapters }; }
    if (chapters > 1000) { return { index: 2, count: chapters }; }
    return { index: 1, count: chapters };
  }

  percentile(kind, data) {
    const percentile = kind === 'anime' ? data.percentiles.time : data.percentiles.units;
    const percentage = percentile * 100;
    if (Number(percentage).toFixed(0) >= 100) {
      return 99;
    }
    return percentage;
  }

  timeSpent(kind, data) {
    const primaryUnit = this.primaryUnit(kind, data);
    const percentile = this.percentile(kind, data);
    const timeUnitText = kind === 'anime' ? primaryUnit.count === 1 ? primaryUnit.name.slice(0, primaryUnit.name.length - 1) : primaryUnit.name : null;
    return (
      <View style={styles.timeSpentWrap}>
        <View style={styles.timeSpent}>
          <FastImage
            style={styles.timeImage}
            source={imageMap[`${kind}${primaryUnit.index}`]}
            resizeMode="contain"
            cache="web"
          />
          <View style={{ flexDirection: 'column', marginLeft: 60 }}>
            <StyledText bold size="xsmall" color="dark" textStyle={{ marginBottom: 5 }}>
              {/* toLocaleString doesn't work on Android */}
              {primaryUnit.count.toString().includes('.') ? primaryUnit.count.toFixed(1) : primaryUnit.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {' '}
              {kind === "anime" ? `${timeUnitText} spent watching anime.` : "chapters read."}
            </StyledText>
            <StyledText size="xxsmall" color="grey">
              {data.completed > 0 && (`${data.completed.toLocaleString('en-US')} completed. `)}
              {percentile > 0 && (
                <React.Fragment>
                  {"More than "}
                  <StyledText bold size="xxsmall" color="darkGrey">{`${percentile.toFixed(0)}% `}</StyledText>
                  {"of users."}
                </React.Fragment>
              )}
            </StyledText>
          </View>
        </View>
      </View>
    )
  }

  // header: "Looks like you don't have enough data yet! Ready to start something new?"
  //       guest-header: "Looks like {user} doesn't have any stats yet."
  render() {
    const { kind, data, loading, isCurrentUser } = this.props;
    if (Object.keys(data).length === 0) { return null; }

    const amountConsumed = data[`${kind}-amount-consumed`];
    const categoryBreakdown = data[`${kind}-category-breakdown`];
    if (!amountConsumed || Object.keys(amountConsumed).length === 0) { return null; }
    if (kind === 'anime' && amountConsumed.statsData.time < 1) { return null; }
    if (kind === 'manga' && amountConsumed.statsData.units < 1) { return null; }

    return (
      <View style={styles.wrap}>
        <View style={styles.main}>
          <StyledText bold size="xsmall" color="dark">{`${capitalize(kind)} Stats`}</StyledText>
        </View>
        {loading ? (
          <View style={{ height: 120 }}>
            <View style={styles.loading}>
              <ActivityIndicator color={darkPurple} />
            </View>
          </View>
        ) : (
            <React.Fragment>
              {categoryBreakdown && categoryBreakdown.statsData.total >= 1 ? this.categoryBreakdown(categoryBreakdown.statsData) : (
                <StyledText size="xsmall" color="dark" textStyle={{ textAlign: 'center' }}>
                  {isCurrentUser ? "Looks like you don't have enough data yet! Ready to start something new?" : "Looks like this user doesn't have any stats at the moment."}
                </StyledText>
              )}
              {this.timeSpent(kind, amountConsumed.statsData)}
            </React.Fragment>
          )}
      </View>
    );
  }
};
