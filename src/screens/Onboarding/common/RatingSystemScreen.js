import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { defaultAvatar, defaultCover } from 'kitsu/constants/app';
import awful from 'kitsu/assets/img/ratings/awful.png';
import good from 'kitsu/assets/img/ratings/good.png';
import great from 'kitsu/assets/img/ratings/great.png';
import meh from 'kitsu/assets/img/ratings/meh.png';
import starFilled from 'kitsu/assets/img/ratings/star.png';
import starEmpty from 'kitsu/assets/img/ratings/no-rating-star.png';
import _ from 'lodash';
import { styles } from './styles';

const getRatingSystem = (type) => {
  switch (type) {
    case 'simple':
      return <Simple />;
    case 'regular':
      return <Regular />;
    case 'advanced':
      return <Advanced />;
    default:
      return null;
  }
};

const Simple = () => (
  <View style={{ flexDirection: 'row' }}>
    <Image source={awful} style={styles.imageSimple} />
    <Image source={good} style={styles.imageSimple} />
    <Image source={great} style={styles.imageSimple} />
    <Image source={meh} style={styles.imageSimple} />
  </View>
);

const Regular = () => (
  <View style={{ flexDirection: 'row' }}>
    {Array(5)
      .fill({})
      .map(() => <Image source={starFilled} style={styles.imageRegular} />)}
  </View>
);

const Advanced = () => (
  <View style={{ flexDirection: 'row' }}>
    {Array(10)
      .fill({})
      .map(() => <Image source={starFilled} style={styles.imageAdvanced} />)}
  </View>
);

const RatingSystem = ({ style, type, selected, onSelectSystem }) => {
  const selectedRowStyle = selected ? styles.rowSelected : null;
  const selectedTextStyle = selected ? styles.textSelected : null;
  return (
    <TouchableOpacity
      onPress={() => onSelectSystem(type)}
      style={[styles.rowWrapper, styles.rowRating, selectedRowStyle, style]}
    >
      <Text style={[styles.text, selectedTextStyle]}>{_.upperFirst(_.toLower(type))}</Text>
      {getRatingSystem(type)}
    </TouchableOpacity>
  );
};

class RatingSystemSelect extends React.Component {
  state = {
    selectedSystem: 'simple',
  };

  onSelectSystem = (accountType) => {
    this.setState({ selectedSystem: accountType });
  };

  render() {
    const { navigate } = this.props.navigation;
    const { selectedSystem } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={styles.tutorialText}>
            How would you prefer to rate the things you’ve seen and read?
          </Text>
          <RatingSystem
            style={{ marginTop: 24 }}
            type={'simple'}
            selected={selectedSystem === 'simple'}
            onSelectSystem={this.onSelectSystem}
          />
          <RatingSystem
            type={'regular'}
            selected={selectedSystem === 'regular'}
            onSelectSystem={this.onSelectSystem}
          />
          <RatingSystem
            type={'advanced'}
            selected={selectedSystem === 'advanced'}
            onSelectSystem={this.onSelectSystem}
          />
          <Button
            style={{ marginHorizontal: 0, marginTop: 32 }}
            onPress={() => navigate('SelectAccountScreen')}
            title={`Use ${_.upperFirst(_.toLower(selectedSystem))} Ratings`}
            titleStyle={styles.buttonTitleStyle}
          />
        </View>
      </View>
    );
  }
}

export default RatingSystemSelect;
