import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLayout } from '@react-native-community/hooks';
import React from 'react';
import { StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import Spinner from '@/components/Feedback/Spinner';
import * as palette from '@/constants/palette';

import { ButtonChildren, ButtonColor, ButtonProps } from './Button';

const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);

const SPRING = {
  duration: 400,
  dampingRatio: 0.5,
  stiffness: 1,
};

type ColorScheme = { normal: string; active: string };

type SolidButtonProps = Omit<ButtonProps, 'color' | 'kind'> & {
  color: ButtonColor | ColorScheme;
} & ButtonChildren;

export default function SolidButton({
  color,
  style,
  loading,
  disabled,
  ...args
}: SolidButtonProps) {
  const scheme = typeof color === 'string' ? colors[color] : color;
  const { onLayout, ...layout } = useLayout();

  const pressed = useSharedValue(0);
  const backgroundColor = useDerivedValue(() =>
    interpolateColor(
      pressed.value,
      [0, 1],
      ['transparent', scheme.active],
      'HSV'
    )
  );
  const borderColor = useDerivedValue(() =>
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
      [0, 1],
      [scheme.normal, palette.white],
      'HSV'
    )
  );

  const children = args.bare ? (
    args.children
  ) : (
    <>
      {args.faIcon ? (
        <AnimatedFontAwesome
          name={args.faIcon}
          style={[styles.buttonIcon, args.faIconStyle, { color: textColor }]}
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
      onLayout={onLayout}
      style={[
        style,
        // This ensures the background will fall back to the normal color when the animation resets
        { borderColor: scheme.normal },
        { backgroundColor, borderColor },
        disabled && styles.disabled,
        styles.buttonOuter,
      ]}>
      <RectButton
        style={styles.buttonInner}
        rippleColor={scheme.active}
        rippleRadius={Math.max(layout.width, layout.height) / 1.5}
        activeOpacity={0}
        onActiveStateChange={(active) =>
          (pressed.value = withSpring(active ? 1 : 0, SPRING))
        }
        {...args}>
        {loading ? <Spinner fill={scheme.normal} /> : children}
      </RectButton>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonOuter: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
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
  },
  pink: {
    normal: palette.pink[4],
    active: palette.pink[5],
  },
  yellow: {
    normal: palette.yellow[4],
    active: palette.yellow[5],
  },
  green: {
    normal: palette.green[4],
    active: palette.green[5],
  },
  blue: {
    normal: palette.blue[4],
    active: palette.blue[5],
  },
  purple: {
    normal: palette.purple[4],
    active: palette.purple[5],
  },
  'kitsu-purple': {
    normal: palette.kitsuPurple[3],
    active: palette.kitsuPurple[4],
  },
  grey: {
    normal: palette.grey[3],
    active: palette.grey[4],
  },
};
