import React from 'react';
import { TabNavigator, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { fetchAlgoliaKeys } from 'kitsu/store/app/actions';
import { fetchNotifications } from 'kitsu/store/feed/actions';
import { tabRed, listBackPurple } from 'kitsu/constants/colors';
import SearchStack from './search';
import NotificationsStack from './notification';
import QuickUpdateStack from './quickUpdate';
import FeedStack from './feed';
import SidebarStack from './sidebar';

const Tabs = TabNavigator(
  {
    Feed: {
      screen: FeedStack,
    },
    Search: {
      screen: SearchStack,
    },
    QuickUpdate: {
      screen: QuickUpdateStack,
    },
    Notifications: {
      screen: NotificationsStack,
    },
    Menu: {
      screen: SidebarStack,
    },
  },
  {
    lazy: true,
    removeClippedSubviews: true,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    navigationOptions: ({ navigation }) => ({
      tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {
        // The routes we should reset nav for
        const resetRoutes = ['Notifications', 'Sidebar', 'QuickUpdate'];
        const { routes } = previousScene;

        // Check if we have pushed any other routes
        if (!scene.focused && routes.length > 1) {
          const { routeName } = routes[0];

          // Check if the route is the one we have to reset
          if (resetRoutes.includes(routeName)) {
            navigation.dispatch(NavigationActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName })],
            }));
          }
        }
        // Move to the tab
        jumpToIndex(scene.index);
      },
    }),
    tabBarOptions: {
      activeTintColor: tabRed,
      inactiveBackgroundColor: listBackPurple,
      activeBackgroundColor: listBackPurple,
      showLabel: false,
      showIcon: true,
      iconStyle: {
        width: 44,
        height: 44,
      },
      style: {
        height: 44.96,
        borderTopWidth: 0,
        backgroundColor: listBackPurple,
      },
      tabStyle: {
        height: 44.96,
        borderTopWidth: 0,
      },
      indicatorStyle: {
        backgroundColor: tabRed,
      },
      backgroundColor: listBackPurple,
    },
  },
);

class TabsNav extends React.PureComponent {
  static propTypes = {
    badge: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
    fetchCurrentUser: PropTypes.func.isRequired,
    fetchAlgoliaKeys: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.fetchCurrentUser();
    this.props.fetchAlgoliaKeys();
  }

  fetchCurrentUser = async () => {
    await this.props.fetchCurrentUser();
    this.props.fetchNotifications();
  }

  render() {
    return (
      <Tabs screenProps={{ rootNavigation: this.props.navigation, badge: this.props.badge }} />
    );
  }
}

const mapper = ({ feed }) => ({
  badge: feed.notificationsUnseen,
});

export default connect(mapper, { fetchCurrentUser, fetchAlgoliaKeys, fetchNotifications })(TabsNav);
