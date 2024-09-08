import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { ComponentProps } from 'react';
import { TextStyle } from 'react-native';
import { BaseButtonProps } from 'react-native-gesture-handler';

import OutlineButton from './OutlineButton';
import SolidButton from './SolidButton';

export type ButtonKind =
  /** A solid button. Useful anywhere you need something pressable. */
  | 'solid'
  /** A button with no background, just an outline. Useful for secondary actions and situations
   *  where you want to de-emphasize the button. */
  | 'outline';

export type ButtonColor =
  | 'red'
  | 'pink'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'kitsu-purple'
  | 'grey';

export type ButtonChildren =
  | {
      bare: true;
      children: React.ReactNode;
    }
  | {
      bare: false | undefined;
      /** The text for the button */
      text: string;
      /** The text styles for the button */
      textStyle?: TextStyle;
      /** The FontAwesome icon for the button */
      faIcon?: ComponentProps<typeof FontAwesome>['name'];
      /** The icon styles for the button */
      faIconStyle?: TextStyle;
    };

export type ButtonProps = {
  /** The kind of button to render */
  kind: ButtonKind;
  /** The primary color of the button */
  color: ButtonColor;
  /** Whether the button should be rendered in a loading state. Also disables interactivity, but
   *  does *not* render a disabled state */
  loading?: boolean;
  /** Whether the button should be non-interactive; disables pointer events and styles the button
   *  accordingly. */
  disabled?: boolean;
} & Omit<BaseButtonProps, 'children'> &
  ButtonChildren;

/**
 * The `<Button>` component represents a clickable button, used to submit forms or anywhere in a
 * document for accessible, standard button functionality.  It also provides a loading indicator to
 * inform the user when the button is performing a task.
 */
export default function Button({ kind = 'solid', ...args }: ButtonProps) {
  const Component =
    kind === 'solid'
      ? SolidButton
      : kind === 'outline'
      ? OutlineButton
      : SolidButton;
  return <Component {...args} />;
}

export const ButtonPreset: { [key: string]: Partial<ButtonProps> } = {
  PRIMARY: {
    kind: 'solid',
    color: 'green',
  },
};
