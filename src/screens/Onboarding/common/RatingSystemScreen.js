import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { upperFirst, toLower } from 'lodash';
import { Button } from 'kitsu/components/Button';
import awful from 'kitsu/assets/img/ratings/awful.png';
import good from 'kitsu/assets/img/ratings/good.png';
import great from 'kitsu/assets/img/ratings/great.png';
import meh from 'kitsu/assets/img/ratings/meh.png';
import starFilled from 'kitsu/assets/img/ratings/star.png';
import { updateLibrarySettings } from 'kitsu/store/user/actions/';
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
      .map((v, i) => <Image key={i} source={starFilled} style={styles.imageRegular} />)}
  </View>
);

const Advanced = () => (
  <View style={{ flexDirection: 'row' }}>
    {Array(10)
      .fill({})
      .map((v, i) => <Image key={i} source={starFilled} style={styles.imageAdvanced} />)}
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
      <Text style={[styles.text, selectedTextStyle]}>{upperFirst(toLower(type))}</Text>
      {getRatingSystem(type)}
    </TouchableOpacity>
  );
};

class RatingSystemScreen extends React.Component {
  state = {
    ratingSystem: 'simple',
  };

  onSelectSystem = (accountType) => {
    this.setState({ ratingSystem: accountType });
  };

  onConfirm = async () => {
    const { ratingSystem } = this.state;
    const success = await this.props.updateLibrarySettings({ ratingSystem });
    const { navigate, state } = this.props.navigation;
    console.log(state.params.selected);
    if (success) {
      navigate('ManageLibrary', {
        account: state.params.account,
      });
    }
  };

  render() {
    const { ratingSystem } = this.state;
    const { loading } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={styles.tutorialText}>
            How would you prefer to rate the things you’ve seen and read?
          </Text>
          <RatingSystem
            style={{ marginTop: 24 }}
            type={'simple'}
            selected={ratingSystem === 'simple'}
            onSelectSystem={this.onSelectSystem}
          />
          <RatingSystem
            type={'regular'}
            selected={ratingSystem === 'regular'}
            onSelectSystem={this.onSelectSystem}
          />
          <RatingSystem
            type={'advanced'}
            selected={ratingSystem === 'advanced'}
            onSelectSystem={this.onSelectSystem}
          />
          <Button
            loading={loading}
            style={{ marginHorizontal: 0, marginTop: 32 }}
            onPress={this.onConfirm}
            title={`Use ${upperFirst(toLower(ratingSystem))} Ratings`}
            titleStyle={styles.buttonTitleStyle}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({ user }) => {
  const { loading, error } = user;
  return { loading, error };
};
export default connect(mapStateToProps, { updateLibrarySettings })(RatingSystemScreen);
