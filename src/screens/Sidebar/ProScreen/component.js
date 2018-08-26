import React, { PureComponent } from 'react';
import { View, Image, Dimensions, ScrollView, Text, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
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
import { TitleTag } from 'kitsu/components/TitleTag';
import { kitsuConfig } from 'kitsu/config/env';
import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { Sentry } from 'react-native-sentry';
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
    // Just incase RNIap is undefined
    if (RNIap) {
      RNIap.endConnection();
    }
  }

  // Error messages for the validation
  getErrorMessages(status) {
    const defaultMessage = {
      detail: 'Unknown error occurred',
      message: 'Failed to validate receipt.',
    };

    const errorMessages = {
      // Auth errors
      401: {
        detail: 'Failed to authenticate user',
        message: 'Failed to authenticate user. Please restart the app and try again.',
      },

      // Validation errors (4XX = Client, 5XX = server)
      400: {
        detail: 'Malformed receipt',
        message: 'Something went wrong with the receipt. Please try again later.',
      },
      402: {
        detail: 'Error',
        message: 'Something went wrong. Please try again later.',
      },
      500: {
        detail: 'Invalid JSON or Invalid Secret',
        message: 'Failed to validate purchase. Please try again later.',
      },
      502: {
        detail: 'Validation server unavailable',
        message: 'Failed to validate purchase, The validation server is unavailable. Please try again later.',
      },
    };

    return errorMessages[status] || defaultMessage;
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
      // `getAvailablePurchases` only work on actual devices
      if (!isEmulator()) {
        // we use `getAvailablePurchases` instead of `getPurchaseHistory` because
        // the former function returns an empty array if a subscription has ended
        // the latter functions returns any previous subscriptions regardless of if they expired
        purchases = await RNIap.getAvailablePurchases();
      }

      this.setState({ subscriptions, purchases, loading: false });
    } catch (e) {
      // Errors from `getSubscriptions` and `getPurchaseHistory`

      // Send the log to sentry
      Sentry.captureMessage('Failed to fetch products', {
        tags: {
          type: 'iap',
        },
        extra: {
          error: (e instanceof Error) ? e.message : e,
        },
      });
      this.setState({ loading: false, error: expect });
      console.warn('Failed to fetch products: ', e); // standardized err.code and err.message available
    }
  }

  updateNavigationParams() {
    this.props.navigation.setParams({
      currentUser: this.props.currentUser,
    });
  }

  /**
   * Take the user through purchasing PRO via iAP
   */
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
    let receipt = null;
    try {
      receipt = await RNIap.buySubscription(sku);
      console.log(receipt);
      await this.fetchProducts();
    } catch (e) {
      // Errors from `buySubscription`

      // Make sure it's not the cancel error
      if (!e.code || e.code !== 'E_USER_CANCELLED') {
        // Send the log to sentry
        Sentry.captureMessage('Failed to purchase pro', {
          tags: {
            type: 'iap',
          },
          extra: {
            error: (e instanceof Error) ? e.message : e,
          },
        });

        this.setState({ error: e });
        console.warn('Failed to purchase pro: ', e);
      }
    }

    // We either errored out or didn't get a receipt
    if (!receipt) return;

    // Validate the receipt
    this.validatePurchase(receipt);
  }

  /**
   * Validate a purchase made by the user.
   */
  validatePurchase = async (receipt) => {
    // only iOS and Android supported
    const platform = Platform.OS.toLowerCase();
    if (platform !== 'ios' && platform !== 'android') return;

    try {
      const { tokens, fetchCurrentUser } = this.props;

      // Make sure user is authenticated
      if (isEmpty(tokens) || isEmpty(tokens.access_token)) {
        throw new Error('No authentication tokens found');
      }

      // Make sure we have a valid receipt
      if (isEmpty(receipt)) {
        throw new Error('Empty Receipt');
      }

      const url = `${kitsuConfig.baseUrl}/pro-subscription/${platform}`;

      this.setState({ loading: true, error: null });

      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ receipt }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      // Error handling
      if (!res.ok) {
        const status = parseInt(res.status, 10);
        const messages = this.getErrorMessages(status);

        // eslint-disable-next-line no-throw-literal
        throw { status, ...messages };
      }

      // Fetch the new user
      await fetchCurrentUser();
      this.setState({ loading: false });
    } catch (e) {
      // Errors from validation
      let error = new Error('Failed to validate purchase.');

      // We can get different types of error objects
      // Need to handle them
      if (e instanceof Error) {
        error = e;
      } else if (e && e.message) {
        error = new Error(e.message);
      } else if (typeof e === 'string') {
        error = new Error(e);
      }

      // Send the log to sentry
      Sentry.captureMessage('Failed to validate purchase', {
        tags: {
          type: 'iap',
        },
        extra: {
          receipt,
          error: (e instanceof Error) ? e.message : e,
        },
      });

      this.setState({ error, loading: false });
      console.warn('Validation failed: ', error);
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

  renderPurchaseRestore() {
    const { purchases } = this.state;

    return (
      <View style={styles.proCard}>
        <Text style={styles.restorePurchaseText}>We have detected that you have bought Kitsu Pro but haven't applied it to the current account.</Text>
        <TouchableOpacity
          style={styles.proButton}
          onPress={() => {
            if (purchases.length === 0) return;

            const purchase = purchases[0];
            const receipt = purchase && purchase.transactionReceipt;

            if (isEmpty(receipt)) return;

            this.validatePurchase(receipt);
          }}
        >
          <Text style={styles.proButtonText}>Apply Kitsu PRO</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderProTimeRemaining() {
    const { currentUser } = this.props;

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

  renderProCard() {
    /*
      TODO: Not sure how we're going to handle this case:
        - User buys pro
        - Cancels subscription
        - Wants to re-subscribe to PRO

      When user cancels subscription on Android, the purchase array is still populated.
      The attribute `autoRenewal` is set to `false` however and this can tell us if user has decided not to continue subscription.

      We might need to add a way for the user to re-subscribe if they accidentally unsubscribed.
      This can be done easily by allowing them access to the `Upgrade to PRO` button.
    */

    const { currentUser } = this.props;
    const { purchases, loading } = this.state;
    const pro = isPro(currentUser);

    if (loading) {
      return (
        <View style={styles.proCard}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    // Only show pro time remaining if user is PRO
    if (pro) return this.renderProTimeRemaining();

    // Only show the restoration card if we have a purchase and user isn't pro
    if (purchases.length > 0 && !pro) return this.renderPurchaseRestore();

    // Show option to purchase PRO
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
          <TitleTag title="PRO" />
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
    const logoWidth = Math.min(screenWidth * 0.3, 250);
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

const mapStateToProps = ({ user, auth }) => {
  const { currentUser } = user;
  const { tokens } = auth;
  return { currentUser, tokens };
};

export default connect(mapStateToProps, { fetchCurrentUser })(ProScreen);
