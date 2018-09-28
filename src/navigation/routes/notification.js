import * as Screens from 'kitsu/navigation/types';

import NotificationsScreen from 'kitsu/screens/Notifications/NotificationsScreen';
import { NotificationOverlay } from 'kitsu/screens/Notifications/NotificationOverlay';

export default notificationRoutes = {
  [Screens.NOTIFICATION]: NotificationsScreen,
  [Screens.NOTIFICATION_OVERLAY]: NotificationOverlay,
};
