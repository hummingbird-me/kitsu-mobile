import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Spinner from '@/components/Feedback/Spinner';
import * as palette from '@/constants/palette';

import { ButtonChildren, ButtonColor, ButtonProps } from './Button';

const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);

const ANIMATION = {
  duration: Platform.OS === 'android' ? 500 : 200,
  easing: Easing.inOut(Easing.cubic),
};

type ColorScheme = { normal: string; active: string; text: string };

type SolidButtonProps = Omit<ButtonProps, 'color' | 'kind'> & {
  color: ButtonColor | ColorScheme;
} & ButtonChildren;

export default function SolidButton({
  color,
  style,
  loading,
  disabled,
  onPress,
  ...args
}: SolidButtonProps) {
  const scheme = typeof color === 'string' ? colors[color] : color;

  const pressed = useSharedValue(0);
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      pressed.value,
      [0, 1],
      [scheme.normal, scheme.active],
      'HSV'
    )
  );
  const textColor = useDerivedValue(() =>
    interpolateColor(
      pressed.value,
      [0, 1.5], // Make it a bit more subtle
      [scheme.text, scheme.active],
      'RGB'
    )
  );

  const children = args.bare ? (
    args.children
  ) : (
    <>
      {args.faIcon ? (
        <AnimatedFontAwesome
          name={args.faIcon}
          color={textColor}
          style={[styles.buttonIcon, args.faIconStyle]}
        />
      ) : null}
      <Animated.Text
        style={[styles.buttonText, args.textStyle, { color: textColor }]}>
        {args.text}
      </Animated.Text>
    </>
  );

  return (
    <Animated.View
      style={[
        style,
        // This ensures the background will fall back to the normal color when the animation resets
        { backgroundColor: scheme.normal },
        { backgroundColor },
        disabled && styles.disabled,
        styles.buttonOuter,
      ]}>
      <RectButton
        style={styles.buttonInner}
        onPress={onPress}
        rippleColor={scheme.active}
        activeOpacity={0}
        onActiveStateChange={(active) =>
          (pressed.value = withTiming(active ? 1 : 0, ANIMATION))
        }
        {...args}>
        {loading ? <Spinner fill={scheme.text} /> : children}
      </RectButton>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonInner: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 17,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
    fontSize: 17,
  },
});

const colors: { [key in ButtonColor]: ColorScheme } = {
  red: {
    normal: palette.red[4],
    active: palette.red[5],
    text: palette.white,
  },
  pink: {
    normal: palette.pink[4],
    active: palette.pink[5],
    text: palette.white,
  },
  yellow: {
    normal: palette.yellow[4],
    active: palette.yellow[5],
    text: palette.white,
  },
  green: {
    normal: palette.green[4],
    active: palette.green[5],
    text: palette.white,
  },
  blue: {
    normal: palette.blue[4],
    active: palette.blue[5],
    text: palette.white,
  },
  purple: {
    normal: palette.purple[4],
    active: palette.purple[5],
    text: palette.white,
  },
  'kitsu-purple': {
    normal: palette.kitsuPurple[4],
    active: palette.kitsuPurple[5],
    text: palette.white,
  },
  grey: {
    normal: palette.grey[1],
    active: palette.grey[3],
    text: palette.black,
  },
};
