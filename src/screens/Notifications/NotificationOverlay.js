import React, { PureComponent } from 'react';
import { Platform, StyleSheet, View, Animated } from 'react-native';
import { PropTypes } from 'prop-types';
import { Navigation } from 'react-native-navigation';
import { NotificationPopover } from 'kitsu/components/NotificationPopover';
import { store } from 'kitsu/store/config';
import { markNotifications } from 'kitsu/store/feed/actions';
import { handleNotificationPress } from 'kitsu/utils/notifications';
import { Screens } from 'kitsu/navigation';

const NOTIFICATION_VISIBLE_TIME = 5000;

export class NotificationOverlay extends PureComponent {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
    notification: PropTypes.object.isRequired,
  }

  static options() {
    return {
      layout: {
        backgroundColor: 'transparent',
      },
    };
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      Navigation.dismissOverlay(this.props.componentId);
    }, NOTIFICATION_VISIBLE_TIME);
  }

  /* Dismisses overlay on press or whatever you want */
  onNotificationPressed = async () => {
    const { notification, componentId } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Hide notification
    setTimeout(() => {
      Navigation.dismissOverlay(componentId);
    }, 200);

    // Navigate to notification tab
    Navigation.mergeOptions(Screens.BOTTOM_TABS, {
      bottomTabs: {
        // TODO: Change this once RNN fixes currentTabId
        currentTabIndex: 3,
        // currentTabId: Screens.NOTIFICATION,
      },
    });

    // Apply navigation
    handleNotificationPress(Screens.NOTIFICATION, notification);
  }

  render() {
    return (
      <NotificationPopover
        data={this.props.notification}
        onRequestClose={this.onNotificationPressed}
        style={styles.notificationContainer}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});
