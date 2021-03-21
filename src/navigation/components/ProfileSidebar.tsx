import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLayout } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';

import useAccount from 'app/hooks/useAccount';
import Image from 'app/components/Image';
import Blurhash from 'app/components/Blurhash';
import { Asap } from 'app/constants/fonts';
import Button from 'app/components/Button';
import { SessionContext } from 'app/contexts/SessionContext';

export default function ProfileSidebar() {
  const { loading, error, data } = useAccount();
  const { top, left, bottom } = useSafeAreaInsets();
  const { onLayout, ...layout } = useLayout();
  const { clearSession } = useContext(SessionContext);
  const navigation = useNavigation();

  return (
    <View onLayout={onLayout} style={{ flexDirection: 'column' }}>
      <View
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
          <Text style={{ color: 'white', fontFamily: Asap.bold, fontSize: 20 }}>
            {data?.profile.name}
          </Text>
        </View>
      </View>
      <ScrollView style={{ height: '100%' }}>
        <Button
          kind="white"
          onPress={() => {
            clearSession();
            navigation.navigate('Intro');
          }}>
          Log out
        </Button>
        <Text>Hewwo {data?.profile?.name}</Text>
      </ScrollView>
    </View>
  );
}
