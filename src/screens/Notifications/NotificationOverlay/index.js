import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import { PropTypes } from 'prop-types';
import { Navigation } from 'react-native-navigation';
import { EventBus } from 'kitsu/utils/eventBus';
import { NOTIFICATION_PRESSED_EVENT } from 'kitsu/screens/Notifications/NotificationsScreen';
import { NotificationPopover } from './components/NotificationPopover';
import { styles } from './styles';

const ANIM_DURATION = 200;
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

  state = {
    opacity: new Animated.Value(0),
    yValue: new Animated.Value(-200),
  };

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.yValue, {
        toValue: 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
    this.timeout = setTimeout(this.dismissOverlay, NOTIFICATION_VISIBLE_TIME);
  }

  /* Dismisses overlay on press or whatever you want */
  onNotificationPressed = async () => {
    const { notification } = this.props;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    EventBus.publish(NOTIFICATION_PRESSED_EVENT, notification);
    this.dismissOverlay();
  }

  dismissOverlay = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: ANIM_DURATION,
      useNativeDriver: true,
    }).start(() => {
      // TODO: This doesn't seem to dismiss overlay the first time
      Navigation.dismissOverlay(this.props.componentId);
    });
  };

  render() {
    return (
      <Animated.View
        style={[styles.container, {
          opacity: this.state.opacity,
          transform: [{ translateY: this.state.yValue }],
        }]}
      >
        <NotificationPopover
          data={this.props.notification}
          onPress={this.onNotificationPressed}
          style={styles.notificationContainer}
        />
      </Animated.View>
    );
  }
}