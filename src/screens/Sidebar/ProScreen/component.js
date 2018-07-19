import React, { PureComponent } from 'react';
import { View, Image, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import { logo } from 'kitsu/assets/img/pro';
import { isPro } from 'kitsu/utils/user';
import { SidebarHeader } from 'kitsu/screens/Sidebar/common';
import { styles } from './styles';

class ProScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: () => {
      const user = navigation.state.params && navigation.state.params.currentUser;
      const pro = isPro(user);

      return (
        <SidebarHeader
          navigation={navigation}
          headerTitle={pro ? 'PRO' : 'Upgrade to PRO'}
          hideCover
        />
      );
    },
    tabBarVisible: false,
  });

  static propTypes = {
    navigation: PropTypes.any.isRequired,
    currentUser: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.updateNavigationParams();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.currentUser, nextProps.currentUser)) {
      this.updateNavigationParams();
    }
  }

  updateNavigationParams() {
    this.props.navigation.setParams({
      currentUser: this.props.currentUser,
    });
  }

  renderProCard() {
    const { currentUser } = this.props;
    const pro = isPro(currentUser);
    return (
      <View style={styles.proCard}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceTag}>$4</Text>
          <View>
            <Text style={styles.durationText}>Per Month</Text>
            <Text style={styles.billText}>BILLED ANNUALLY</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.proButton}>
          <Text style={styles.proButtonText}>Upgrade to PRO</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderProPerks() {
    return (
      <View style={styles.perksContainer}>
      </View>
    );
  }

  renderGradientInfo() {
    // We need the exact width and height so that we can add an underline to the logo
    const screenWidth = Dimensions.get('screen').width;
    const logoWidth = Math.min(screenWidth * 0.3, 404);
    const logoHeight = logoWidth * (76 / 404);

    return (
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        colors={['#E8784A', '#EA4C89']}
        style={styles.gradientContainer}
      >
        <View style={[styles.kitsuLogoContainer, { width: logoWidth }]}>
          <Image
            source={logo}
            resizeMode="contain"
            style={{ width: logoWidth, height: logoHeight }}
          />
        </View>
        <View>
          <Text style={styles.proTitle}>
            Show your support for Kitsu, become PRO.
          </Text>
          <Text style={styles.proDescription}>
            Kitsu is on a mission to build the world's best platform for anime and manga fans. With your Pro account, you'll be showing your support for the community. Plus you'll get some sweet perks for being awesome.
          </Text>
        </View>
        {this.renderProCard()}
      </LinearGradient>
    );
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <ScrollView>
          {/* Top info */}
          {this.renderGradientInfo()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(ProScreen);
