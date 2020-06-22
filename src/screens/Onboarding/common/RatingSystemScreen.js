import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { upperFirst, toLower } from 'lodash';
import { Button } from 'app/components/Button';
import awful from 'app/assets/img/ratings/awful.png';
import good from 'app/assets/img/ratings/good.png';
import great from 'app/assets/img/ratings/great.png';
import meh from 'app/assets/img/ratings/meh.png';
import starFilled from 'app/assets/img/ratings/star.png';
import { fox } from 'app/assets/img/onboarding/';
import { updateLibrarySettings } from 'app/store/user/actions/';
import { setScreenName } from 'app/store/onboarding/actions';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'app/navigation';
import { styles } from './styles';
import { OnboardingHeader } from 'app/screens/Onboarding/common';

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
    <FastImage source={awful} style={styles.imageSimple} />
    <FastImage source={good} style={styles.imageSimple} />
    <FastImage source={great} style={styles.imageSimple} />
    <FastImage source={meh} style={styles.imageSimple} />
  </View>
);

const Regular = () => (
  <View style={{ flexDirection: 'row' }}>
    {Array(5)
      .fill({})
      .map((v, i) => <FastImage key={i} source={starFilled} style={styles.imageRegular} />)}
  </View>
);

const Advanced = () => (
  <View style={{ flexDirection: 'row' }}>
    {Array(10)
      .fill({})
      .map((v, i) => <FastImage key={i} source={starFilled} style={styles.imageAdvanced} />)}
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
    ratingSystem: this.props.currentUser.ratingSystem,
  };

  onSelectSystem = (accountType) => {
    this.setState({ ratingSystem: accountType });
  };

  onConfirm = async () => {
    const { ratingSystem } = this.state;
    const success = await this.props.updateLibrarySettings({ ratingSystem });
    if (success) {
      Navigation.push(this.props.componentId, {
        component: {
          name: Screens.ONBOARDING_MANAGE_LIBRARY,
          passProps: {
            hasRatedAnimes: this.props.selectedAccount === 'aozora',
          },
        },
      });
    }
  };

  render() {
    const { ratingSystem } = this.state;
    const { loading } = this.props;
    return (
      <View style={styles.container}>
        <OnboardingHeader />
        <ScrollView style={styles.contentWrapper}>
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
        </ScrollView>
        <View style={{ flexDirection: 'row' }}>
          <FastImage source={fox} style={{ width: 50, height: 50, zIndex: 2 }} />
          <View
            style={{
              left: -10,
              bottom: -8,
              height: 32,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 16,
              backgroundColor: '#4f414e',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 12,
              }}
            >
              Don{"'"}t worry, you can change this later!
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = ({ onboarding, user }) => {
  const { selectedAccount } = onboarding;
  const { loading, currentUser, error } = user;
  return { loading, currentUser, selectedAccount, error };
};
export default connect(mapStateToProps, { updateLibrarySettings, setScreenName })(
  RatingSystemScreen,
);
