import React, { PureComponent } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { Navigation } from 'react-native-navigation';

import {
  app,
  blocking,
  library,
  linked,
  privacy,
  settings,
} from 'kitsu/assets/img/sidebar_icons/';
import { Screens } from 'kitsu/navigation';

import {
  ItemSeparator,
  SidebarHeader,
  SidebarListItem,
  SidebarTitle,
} from './common';
import { styles } from './styles';

interface SettingsScreenProps {
  componentId: any;
}

export class SettingsScreen extends PureComponent<SettingsScreenProps> {
  render() {
    return (
      <View style={styles.containerStyle}>
        <SidebarHeader
          headerTitle={'Settings'}
          onBackPress={() => Navigation.pop(this.props.componentId)}
        />
        <ScrollView style={{ flex: 1 }}>
          <SidebarTitle title={'Account Settings'} />
          <FlatList
            data={[
              {
                title: 'General',
                image: settings,
                target: Screens.SIDEBAR_SETTINGS_GENERAL,
              },
              {
                title: 'Privacy',
                image: privacy,
                target: Screens.SIDEBAR_SETTINGS_PRIVACY,
              },
              {
                title: 'Linked Accounts',
                image: linked,
                target: Screens.SIDEBAR_LINKED_ACCOUNTS,
              },
              {
                title: 'Library',
                image: library,
                target: Screens.SIDEBAR_SETTINGS_LIBRARY,
              },
              {
                title: 'Blocking',
                image: blocking,
                target: Screens.SIDEBAR_BLOCKING,
              },
              {
                title: 'App',
                image: app,
                target: Screens.SIDEBAR_SETTINGS_APP,
              },
            ]}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <SidebarListItem
                title={item.title}
                image={item.image}
                onPress={() =>
                  Navigation.push(this.props.componentId, {
                    component: {
                      name: item.target,
                    },
                  })
                }
              />
            )}
            ItemSeparatorComponent={() => <ItemSeparator />}
            removeClippedSubviews={false}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
    );
  }
}
