import Ionicons from '@expo/vector-icons/Ionicons';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import React, { useContext } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from 'urql';

import * as SettingsIcons from '@/assets/icons/sidebar';
import AvatarImage from '@/components/content/AvatarImage';
import BannerImage from '@/components/content/BannerImage';
import { ImageFragment } from '@/components/content/Image';
import * as SettingsList from '@/components/content/SettingsList';
import { OutlineButton } from '@/components/controls/Button';
import { Asap, OpenSans } from '@/constants/fonts';
import { kitsuPurple, white } from '@/constants/palette';
import { useDrawer } from '@/contexts/DrawerContext';
import { SessionContext } from '@/contexts/SessionContext';
import { useStackNavigation } from '@/contexts/StackNavigationContext';
import InvariantViolated from '@/errors/InvariantViolated';
import { graphql } from '@/utils/graphql';

const DrawerUserQuery = graphql(
  `
    query DrawerUserQuery {
      currentAccount {
        id
        profile {
          id
          name
          bannerImage {
            ...ImageFragment
          }
          avatarImage {
            ...ImageFragment
          }
        }
      }
    }
  `,
  [ImageFragment]
);

const COVER_HEIGHT = 200;

export default function Drawer() {
  const drawer = useDrawer();
  const { height: minHeight } = useWindowDimensions();
  const session = useContext(SessionContext);
  if (!session) throw new InvariantViolated('Session context missing');
  const navigation = useStackNavigation();
  const scrollView = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollView);
  const [result] = useQuery({ query: DrawerUserQuery });

  const scale = useDerivedValue(() =>
    Math.max((COVER_HEIGHT + -scrollOffset.value) / COVER_HEIGHT, 1)
  );
  const translateY = useDerivedValue(() => Math.min(scrollOffset.value, 0));

  return (
    <Animated.ScrollView style={styles.drawerContainer} ref={scrollView}>
      <View style={{ minHeight, flex: 1 }}>
        <Pressable
          onPress={() => {
            if (!result.data?.currentAccount?.id) return;
            navigation.navigate('Profile', {
              id: result.data?.currentAccount?.id?.toString(),
              tab: 'summary',
            });
            drawer.current?.closeDrawer();
          }}
          android_ripple={{
            foreground: true,
          }}>
          <SafeAreaView edges={['top', 'left']} style={styles.bannerContainer}>
            <BannerImage
              source={result?.data?.currentAccount?.profile?.bannerImage}
              style={[
                styles.bannerImage,
                { transform: [{ translateY }, { scale }] },
              ]}
            />
            <View style={styles.bannerOverlay}>
              <AvatarImage
                source={result?.data?.currentAccount?.profile?.avatarImage}
                size={50}
              />
              <Text
                style={{
                  fontFamily: Asap.bold,
                  fontSize: 18,
                  color: white,
                }}>
                {result?.data?.currentAccount?.profile?.name}
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                color="white"
                size={24}
                style={{ marginLeft: 'auto', marginRight: 15 }}
              />
            </View>
          </SafeAreaView>
        </Pressable>
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
          <OutlineButton
            color="kitsu-purple"
            style={{ flex: 0, margin: 10 }}
            onPress={() => {
              session.clearSession();
              navigation.navigate('Landing');
              drawer.current?.closeDrawer();
            }}
            text="Log out"
          />
        </View>
        <SafeAreaView edges={['bottom', 'left']} style={{ width: '100%' }}>
          <TouchableOpacity
            onLongPress={() => {
              navigation.navigate('Debug');
              drawer.current?.closeDrawer();
            }}>
            <View>
              <Text style={styles.versionText}>
                {Application.applicationName} {Updates.channel || 'Development'}
              </Text>
              <Text style={styles.versionText}>
                {Application.nativeApplicationVersion} (
                {Application.nativeBuildVersion})
              </Text>
              <Text style={styles.versionText}>{Updates.manifest.id}</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  bannerContainer: {
    height: COVER_HEIGHT,
    justifyContent: 'flex-end',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    height: 200,
    transformOrigin: 'top center',
  },
  bannerOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  versionText: {
    textAlign: 'center',
    color: kitsuPurple[3],
    fontSize: 12,
    fontFamily: OpenSans.normal,
  },
});
