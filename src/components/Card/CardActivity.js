import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Left, Right, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import moment from 'moment';
// import HTMLView from 'react-native-htmlview';

import ProgressiveImage from '../../components/ProgressiveImage';
import HTMLView from '../../components/htmlView';
import * as colors from '../../constants/colors';
import { defaultAvatar } from '../../constants/app';

class CardActivity extends PureComponent {
  shouldComponentUpdate() {
    return false;
  }

  renderMain = (activities) => {
    const aaa = activities.map((item, index) => {
      const subject = item.subject || {};
      if (item.verb === 'post' && subject.content) {
        return (
          <View key={item.id} style={{ marginLeft: -1, paddingLeft: 10, paddingRight: 10 }}>
            <HTMLView
              value={subject.contentFormatted}
              addLineBreaks={false}
              stylesheet={{
                p: { color: '#464646', fontFamily: 'OpenSans', fontSize: 12 },
                img: { width: 200, height: 200 },
              }}
            />
          </View>
        );
      } else if (item.verb === 'updated') {
        return (
          <View key={item.id} style={{ padding: 0, flexDirection: 'row' }}>
            {index === 0 &&
              <ProgressiveImage
                source={{ uri: subject.media ? subject.media.posterImage.small : '' }}
                style={{ height: 120, width: 80, position: 'absolute' }}
              />}
            <Text style={styles.activityText}>
              {item.actor.name}
              {' '}
              {subject.status === 'planned'
                ? 'moved this to Want to Read'
                : subject.status === 'current'
                    ? 'moved this to Currently Watching'
                    : subject.status}
            </Text>
          </View>
        );
      } else if (item.verb === 'progressed') {
        return (
          <View key={item.id} style={{ padding: 0, flexDirection: 'row' }}>
            {index === 0 &&
              <ProgressiveImage
                source={{ uri: subject.media ? subject.media.posterImage.small : '' }}
                style={{ height: 120, width: 80, position: 'absolute' }}
              />}
            <Text style={{ marginLeft: 90 }}>
              {item.actor.name}
              {' '}
              {subject.media && subject.media.type === 'anime'
                ? `watched episode ${item.progress}`
                : `read chapter ${item.progress}`}
            </Text>
          </View>
        );
      } else if (item.verb === 'rated') {
        return (
          <View key={item.id} style={{ padding: 0, flexDirection: 'row' }}>
            {index === 0 &&
              <ProgressiveImage
                source={{ uri: subject.media ? subject.media.posterImage.small : '' }}
                style={{ height: 120, width: 80, position: 'absolute' }}
              />}
            <Text style={{ marginLeft: 90 }}>
              {item.actor.name} rated it {item.rating}
            </Text>
          </View>
        );
      } else if (item.verb === 'media_reaction') {
        const media = subject.anime || subject.manga;
        return (
          <View key={item.id} style={{ padding: 10, flexDirection: 'row' }}>
            <ProgressiveImage
              source={{ uri: media ? media.posterImage.small : '' }}
              style={{ height: 120, width: 80 }}
            />
            <View style={{ flex: 1, alignSelf: 'center' }}>
              <Text style={{ alignSelf: 'center', fontFamily: 'OpenSans', fontSize: 12 }}>
                {item.subject.reaction}
              </Text>

            </View>
          </View>
        );
      }
      return (
        <View key={item.id} style={{ padding: 0 }}>
          <Text>No content</Text>
        </View>
      );
    });
    return (
      <View style={{ padding: 0 }}>
        {aaa}
      </View>
    );
  };
  render() {
    const { props } = this;
    const activities = (props.activities && props.activities[0]) || {};
    const actor = activities.actor || {};
    return (
      <View style={{ backgroundColor: '#F7F7F7' }}>
        <View style={{ ...styles.container, ...props.style }}>
          <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row' }}>
              <Thumbnail
                style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                source={{ uri: actor.avatar ? actor.avatar.original : defaultAvatar }}
              />
              <View style={{ marginLeft: 10 }}>
                <Text
                  style={{
                    color: '#FF4027',
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'OpenSans',
                  }}
                >
                  {actor.name}
                </Text>
                <Text style={{ color: '#909090', fontSize: 11, fontFamily: 'OpenSans' }}>
                  {moment(activities.time).fromNow()}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ minHeight: 120 }}>
            {this.renderMain(props.activities)}
          </View>
          <Text>
            {activities.likes && activities.likes[0].name}
          </Text>
          <View style={styles.footer}>
            <Left>
              <Button
                style={{ height: 35 }}
                transparent
                block
                onPress={() => this.props.onLeftPress()}
              >
                <Icon
                  name="heart"
                  style={{
                    color: props.liked ? colors.activeRed : '#A7A7A7',
                    width: 20,
                    fontSize: 14,
                  }}
                />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: 'bold',
                    fontFamily: 'OpenSans',
                    color: props.liked ? colors.activeRed : '#A7A7A7',
                  }}
                >
                  {props.liked ? 'Liked' : 'Like'}
                </Text>
              </Button>
            </Left>
            <View style={styles.footerDivider} />
            <Right>
              <Button
                style={{ height: 35 }}
                transparent
                block
                onPress={() => this.props.onRightPress()}
              >
                <Icon name="comment" style={{ color: '#A7A7A7', width: 20, fontSize: 14 }} />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: 'bold',
                    fontFamily: 'OpenSans',
                    color: '#A7A7A7',
                  }}
                >
                  {props.rightText}
                </Text>
              </Button>
            </Right>
          </View>
        </View>
      </View>
    );
  }
}

CardActivity.propTypes = {
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  children: PropTypes.any,
};

CardActivity.defaultProps = {
  leftText: 'Like',
  rightText: 'Comment',
  children: {},
  style: {},
  onLeftPress: () => console.log('left pressed'),
  onRightPress: () => console.log('right pressed'),
};

const styles = {
  container: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginTop: 0,
    marginBottom: 5,
    backgroundColor: 'white',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    justifyContent: 'center',
    borderColor: '#EEEEEE',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    fontColor: '#333333',
    fontFamily: 'OpenSans',
  },
  footerDivider: {
    width: 0,
    height: '60%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
  },
  activityText: {
    marginLeft: 90,
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: colors.darkGrey,
    lineHeight: 17,
  },
};

export default CardActivity;
