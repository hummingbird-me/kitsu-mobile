import React, { PureComponent } from 'react';
import { View, Image, Dimensions, ScrollView, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual, isEmpty } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import { logo, art } from 'kitsu/assets/img/pro';
import { isPro } from 'kitsu/utils/user';
import { SidebarHeader } from 'kitsu/screens/Sidebar/common';
import { defaultAvatar } from 'kitsu/constants/app';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage/component';
import * as RNIap from 'react-native-iap';
import { isEmulator } from 'react-native-device-info';
import { styles } from './styles';

// The SKUs for the iAP
const ITEM_SKUS = ['io.kitsu.pro.yearly'];

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

  state = {
    subscriptions: [],
    purchases: [],
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.updateNavigationParams();
    this.prepareIAP();
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.currentUser, nextProps.currentUser)) {
      this.updateNavigationParams();
    }
  }

  componentWillUnmount() {
    RNIap.endConnection();
  }

  async prepareIAP() {
    try {
      await RNIap.prepare();
      this.fetchProducts();
    } catch (err) {
      console.log(err);
    }
  }

  async fetchProducts() {
    this.setState({ loading: true, error: null });
    try {
      const subscriptions = await RNIap.getSubscriptions(ITEM_SKUS);

      let purchases = [];
      // `getPurchaseHistory` only work on actual devices
      if (!isEmulator()) {
        purchases = await RNIap.getPurchaseHistory();
      }

      this.setState({ subscriptions, purchases, loading: false });
    } catch (err) {
      this.setState({ loading: false, error: err });
      console.log(err); // standardized err.code and err.message available
    }
  }

  updateNavigationParams() {
    this.props.navigation.setParams({
      currentUser: this.props.currentUser,
    });
  }

  purchasePro = async () => {
    // Only allow purchase on a device
    if (isEmulator()) {
      Alert.alert('Unavailable', 'Can\'t purchase items on a simulator or emulator!');
      return;
    }

    const { subscriptions } = this.state;
    if (isEmpty(subscriptions)) return;

    const item = subscriptions[0];
    const sku = item.productId;
    if (isEmpty(sku)) return;

    this.setState({ error: null });
    try {
      const receipt = await RNIap.buySubscription(sku);
      console.log(receipt);

      //TODO: Send receipt to server
      this.fetchProducts();
    } catch (err) {
      this.setState({ error: err });
      console.log(err);
    }
  }

  renderError() {
    const { error } = this.state;
    if (!error) return null;

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  renderProCard() {
    const { currentUser } = this.props;
    const { loading } = this.state;
    const pro = isPro(currentUser);

    if (pro) {
      const current = moment();
      const expires = currentUser && currentUser.proExpiresAt;
      const expiresDate = expires && moment(expires);
      const diff = expiresDate && expiresDate.diff(current, 'days');

      const prefix = (diff && diff === 1) ? 'day' : 'days';
      const diffText = expiresDate ? diff : '-';

      return (
        <View style={styles.proCard}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceTag}>PRO Active</Text>
          </View>
          <View style={styles.proButton}>
            <Text style={styles.proButtonText}>{diffText} {prefix} remaining</Text>
          </View>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.proCard}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={styles.proCard}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceTag}>$4 USD</Text>
          <View>
            <Text style={styles.durationText}>Per Month</Text>
            <Text style={styles.billText}>BILLED ANNUALLY</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.proButton} onPress={this.purchasePro}>
          <Text style={styles.proButtonText}>Upgrade to PRO</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderAvatar() {
    const { currentUser } = this.props;
    const avatar = currentUser && currentUser.avatar && currentUser.avatar.medium;
    return (
      <View style={styles.avatarContainer}>
        <View style={styles.avatarMask}>
          <ProgressiveImage
            resize="cover"
            source={{ uri: avatar || defaultAvatar }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.avatarTagContainer}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}
            colors={['#E8784A', '#EA4C89']}
            style={styles.avatarTag}
          >
            <Text style={styles.avatarTagText}>PRO</Text>
          </LinearGradient>
        </View>
      </View>
    );
  }

  renderFooter() {
    return (
      <View style={styles.footer}>
        {this.renderProCard()}
      </View>
    );
  }

  renderProPerks() {
    const perks = [
      {
        title: 'Fancy-pants \'PRO\' badge',
        description: 'See how nice that badge above looks on you? You should wear it home. It was made for you.',
      },
      {
        title: 'No advertising',
        description: 'Hide all ads from your Kitsu experience, doesn\'t apply to Hulu videos (we don\'t control those!)',
      },
      {
        title: 'Early-access to new features',
        description: 'You\'re helping us keep the lights on, you deserve a little VIP treatment. You\'ll get to test new stuff before everyone else!',
      },
    ];

    return (
      <View style={styles.perksContainer}>
        {this.renderAvatar()}
        <View style={styles.perksInfo}>
          <Text style={styles.perksInfoHeading}>THE PERKS OF PRO</Text>
          <View style={styles.perksList}>
            {perks.map((p, index) => {
              const isFirst = index === 0;
              const isLast = index === perks.length - 1;
              return (
                <View
                  key={p.title}
                  style={[
                    styles.perksInfoSection,
                    isLast && styles.perksInfoSection_last,
                    isFirst && styles.perksInfoSection_first,
                  ]}
                >
                  <Text style={styles.perkTitle}>{p.title}</Text>
                  <Text style={styles.perkDescription}>{p.description}</Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.artContainer}>
          <Image
            source={art}
            resizeMode="contain"
            style={styles.art}
          />
        </View>
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
          {/* Errors */}
          {this.renderError()}
          {/* Top info */}
          {this.renderGradientInfo()}
          {/* Perks */}
          {this.renderProPerks()}
          {/* Footer */}
          {this.renderFooter()}
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
