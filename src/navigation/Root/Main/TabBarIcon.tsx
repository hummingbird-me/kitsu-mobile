import React from 'react';
import { Pressable, type GestureResponderEvent } from 'react-native';
import Animated, {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { type SvgProps } from 'react-native-svg';

import { kitsuOrange, kitsuPurple, white } from '@/constants/palette';

const PRESS_SPRING = {
  duration: 400,
  dampingRatio: 0.4,
};

export default function TabBarIcon({
  icon: Icon,
  focused,
  onPress,
}: {
  icon: React.FC<SvgProps>;
  focused: boolean;
  onPress: (e: GestureResponderEvent) => void;
}) {
  const pressed = useSharedValue(0);
  const scale = useDerivedValue(() =>
    interpolate(pressed.value, [0, 1], [1, 0.8])
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (pressed.value = withSpring(1, PRESS_SPRING))}
      onPressOut={() => (pressed.value = withSpring(0, PRESS_SPRING))}
      style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
      android_ripple={{
        color: kitsuPurple[6],
        radius: 50,
        borderless: true,
      }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon
          color={focused ? kitsuOrange : white}
          opacity={focused ? 1 : 0.5}
        />
      </Animated.View>
    </Pressable>
  );
}
