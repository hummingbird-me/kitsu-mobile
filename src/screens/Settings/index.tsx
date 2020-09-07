import React from 'react';
import { ScrollView, Platform, PixelRatio } from 'react-native';
import i18n from 'i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { MainNavigatorParamList } from 'app/navigation/MainNavigator';
import * as SettingsList from 'app/components/SettingsList';
import * as icons from 'app/assets/icons/sidebar';

export default function SettingsScreen({
  navigation,
}: StackScreenProps<MainNavigatorParamList, 'Settings'>) {
  return (
    <ScrollView>
      <SettingsList.Group>Account Settings</SettingsList.Group>
      <SettingsList.Child image={icons.settings}>General</SettingsList.Child>
    </ScrollView>
  );
}
