import React from 'react';
import navigationOptions from 'kitsu/routes/navigationOptions';
import { SidebarHeader } from 'kitsu/screens/Sidebar/common';

export default (navigation, title) => ({
  ...navigationOptions(null),
  header: () => (
    <SidebarHeader
      navigation={navigation}
      headerTitle={title}
    />
  ),
});
