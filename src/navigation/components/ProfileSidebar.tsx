import React, { useContext } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayout } from '@react-native-community/hooks';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import useAccount from 'app/hooks/useAccount';
import Image from 'app/components/Image';
import { Asap } from 'app/constants/fonts';
import * as colors from 'app/constants/colors';
import Button from 'app/components/Button';
import { SessionContext } from 'app/contexts/SessionContext';
import Touchable from 'app/components/Touchable';
import * as SettingsList from 'app/components/SettingsList';
import * as SettingsIcons from 'app/assets/icons/sidebar';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ProfileSidebar({
  closeDrawer,
}: {
  closeDrawer: Function;
}) {
  const { loading, error, data } = useAccount();
  const { top, left, bottom } = useSafeAreaInsets();
  const { onLayout, ...layout } = useLayout();
  const { clearSession } = useContext(SessionContext);
  const navigation = useNavigation();

  return (
    <View
      onLayout={onLayout}
      style={{ flexDirection: 'column', height: '100%' }}>
      <Touchable
        onPress={() => {
          navigation.navigate('Home', { screen: 'Profile' });
          closeDrawer();
        }}
        style={{
          width: '100%',
          height: 150,
        }}>
        <Image
          source={data?.profile.bannerImage}
          height={150}
          width={layout.width ?? 300}
          style={{
            top: 0,
            position: 'absolute',
            width: '100%',
            height: 150,
          }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: Math.max(left, 15),
          }}>
          <Image
            source={data?.profile.avatarImage}
            height={50}
            width={50}
            style={{ height: 50, width: 50, marginRight: 15 }}
            imageStyle={{ borderRadius: 50 }}
            blurhashStyle={{ borderRadius: 50 }}
          />
          <Text
            style={{
              color: 'white',
              fontFamily: Asap.bold,
              fontSize: 20,
              flex: 1,
            }}>
            {data?.profile.name}
          </Text>
          <Ionicons
            name="chevron-forward-outline"
            color="white"
            size={24}
            style={{ marginLeft: 'auto', marginRight: 15 }}
          />
        </View>
      </Touchable>
      <View style={{ flex: 1 }}>
        <SettingsList.Group>Account Settings</SettingsList.Group>
        <SettingsList.Child image={SettingsIcons.settings}>
          Settings & Preferences
        </SettingsList.Child>
        <SettingsList.Child image={SettingsIcons.bugs}>
          Report Bugs
        </SettingsList.Child>
        <SettingsList.Child image={SettingsIcons.suggest}>
          Suggest Features
        </SettingsList.Child>
        <SettingsList.Child image={SettingsIcons.suggest}>
          Database Requests
        </SettingsList.Child>
        <SettingsList.Child image={SettingsIcons.contact}>
          Contact Us
        </SettingsList.Child>
        <Button
          kind="white"
          onPress={() => {
            clearSession();
            navigation.navigate('Intro');
            closeDrawer();
          }}>
          Log out
        </Button>
      </View>
      <View style={{ width: layout.width, marginBottom: bottom }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home', { screen: 'Debug' });
            closeDrawer();
          }}>
          <Text style={{ textAlign: 'center', color: colors.lightPurple }}>
            Kitsu App {Constants.manifest.version} ({Constants.nativeAppVersion}
            )
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
