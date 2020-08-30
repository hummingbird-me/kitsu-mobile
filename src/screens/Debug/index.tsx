import React from 'react';
import { ScrollView, Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import i18n from 'i18next';

import * as SettingsList from 'app/components/SettingsList';

export default function DebugScreen() {
  return (
    <ScrollView>
      <SettingsList.Group>Hardware</SettingsList.Group>
      <SettingsList.Title title="Brand">{Device.brand}</SettingsList.Title>
      <SettingsList.Title title="Manufacturer">
        {Device.manufacturer}
      </SettingsList.Title>
      <SettingsList.Title title="Model Name">
        {Device.modelName}
      </SettingsList.Title>
      <SettingsList.Title title="Year Class">
        {Device.deviceYearClass}
      </SettingsList.Title>

      <SettingsList.Group>Operating System</SettingsList.Group>
      <SettingsList.Title title="OS">{Device.osName}</SettingsList.Title>
      <SettingsList.Title title="Version">
        {Device.osVersion} ({Device.osBuildId})
      </SettingsList.Title>
      {Platform.OS === 'android' ? (
        <SettingsList.Title title="API Level">
          {Device.platformApiLevel}
        </SettingsList.Title>
      ) : null}

      <SettingsList.Group>App</SettingsList.Group>
      <SettingsList.Title title="Ownership">
        {Constants.appOwnership}
      </SettingsList.Title>
      <SettingsList.Title title="Device">
        {Constants.isDevice ? 'Yes' : 'No'}
      </SettingsList.Title>
      <SettingsList.Title title="Version">
        {Constants.nativeAppVersion}
      </SettingsList.Title>
      <SettingsList.Title title="Build">
        {Constants.nativeBuildVersion}
      </SettingsList.Title>
      <SettingsList.Title title="Revision">
        {Constants.manifest.version}
      </SettingsList.Title>
      <SettingsList.Title title="Expo SDK">
        {Constants.manifest.sdkVersion}
      </SettingsList.Title>

      <SettingsList.Group>Settings</SettingsList.Group>
      <SettingsList.Title title="Locale">{i18n.language}</SettingsList.Title>
    </ScrollView>
  );
}
