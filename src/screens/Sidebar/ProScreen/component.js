import React, { PureComponent } from 'react';
import { View, Image, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import { logo, art } from 'kitsu/assets/img/pro';
import { isPro } from 'kitsu/utils/user';
import { SidebarHeader } from 'kitsu/screens/Sidebar/common';
import { styles } from './styles';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import { defaultAvatar } from 'kitsu/constants/app';
import { ProgressiveImage } from '../../../components/ProgressiveImage/component';

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
          <Text style={styles.priceTag}>$4 USD</Text>
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
