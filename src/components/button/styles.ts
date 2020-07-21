import { StyleSheet, Platform } from 'react-native';
import * as colors from 'app/constants/colors';

/* Kinds of Buttons */
export const kinds: {
  [key: string]: {
    background: string;
    text: string;
    border: false | string;
  };
} = {
  green: {
    background: colors.green,
    text: colors.white,
    border: false,
  },
  facebookBlue: {
    background: colors.fbBlue,
    text: colors.white,
    border: false,
  },
  white: {
    background: colors.white,
    text: colors.darkPurple,
    border: false,
  },
  outline: {
    background: colors.transparent,
    text: colors.white,
    border: colors.darkGrey,
  },
  disabled: {
    background: colors.buttonDisabledColor,
    text: colors.white,
    border: false,
  },
};

export function styleSheetForKind(kind: keyof typeof kinds) {
  const theme = kinds[kind];

  return StyleSheet.create({
    button: {
      backgroundColor: theme.background,
      borderColor: theme.border ? theme.border : undefined,
      borderWidth: theme.border ? StyleSheet.hairlineWidth * 4 : 0,
    },
    text: {
      color: theme.text,
    },
  });
}

/* Base Styles for all Buttons */
export const base = StyleSheet.create({
  button: {
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: colors.green,
    height: 47,
    borderRadius: 8,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/* Styles for Button Accessories (icons, text, etc.) */
export const accessory = StyleSheet.create({
  text: {
    color: colors.white,
    fontFamily: 'OpenSans_400Regular',
    lineHeight: Platform.select({ ios: 25, android: 20 }),
    fontSize: 15,
  },
  textBold: {
    fontFamily: 'OpenSans_700Bold',
  },
  icon: {
    fontSize: 20,
    color: colors.white,
    paddingRight: 8,
    paddingLeft: 8,
  },
});
