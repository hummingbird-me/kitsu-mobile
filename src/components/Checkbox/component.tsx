import React from 'react';
import {
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './styles';

type CheckBoxProps = {
  component?: typeof TouchableOpacity;
  checked?: boolean;
  iconRight?: boolean;
  title?: string | React.ReactElement;
  center?: boolean;
  right?: boolean;
  containerStyle?: TouchableOpacityProps['style'];
  textStyle?: TextStyle;
  onPress?: TouchableOpacityProps['onPress'];
  onLongPress?: TouchableOpacityProps['onLongPress'];
  checkedIcon?: string;
  uncheckedIcon?: string;
  size?: number;
  checkedColor?: string;
  uncheckedColor?: string;
  checkedTitle?: string;
  onIconPress?: TouchableOpacityProps['onPress'];
  onLongIconPress?: TouchableOpacityProps['onLongPress'];
  fontFamily?: string;
};

export const CheckBox = ({
  component: Component = TouchableOpacity,
  checked = false,
  iconRight = false,
  title,
  center = false,
  right = false,
  containerStyle,
  textStyle,
  onPress,
  onLongPress,
  onIconPress,
  onLongIconPress,
  size = 24,
  checkedIcon = 'check-square-o',
  uncheckedIcon = 'square-o',
  checkedColor = 'green',
  uncheckedColor = '#bfbfbf',
  checkedTitle,
  fontFamily,
  ...attributes
}: CheckBoxProps) => {
  let iconName = uncheckedIcon;
  if (checked) {
    iconName = checkedIcon;
  }

  return (
    <Component
      {...attributes}
      onLongPress={onLongPress}
      onPress={onPress}
      style={[styles.container, containerStyle && containerStyle]}>
      <View
        style={[
          styles.wrapper,
          right && { justifyContent: 'flex-end' },
          center && { justifyContent: 'center' },
        ]}>
        {!iconRight && (
          <Icon
            color={checked ? checkedColor : uncheckedColor}
            name={iconName}
            size={size || 24}
            onLongPress={onLongIconPress}
            onPress={onIconPress}
          />
        )}

        {React.isValidElement(title) ? (
          title
        ) : (
          <Text
            style={[
              styles.text,
              textStyle && textStyle,
              fontFamily ? { fontFamily } : null,
            ]}>
            {checked ? checkedTitle || title : title}
          </Text>
        )}

        {iconRight && (
          <Icon
            color={checked ? checkedColor : uncheckedColor}
            name={iconName}
            size={size || 24}
            onLongPress={onLongIconPress}
            onPress={onIconPress}
          />
        )}
      </View>
    </Component>
  );
};
