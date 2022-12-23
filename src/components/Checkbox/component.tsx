import React from 'react';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './styles';

interface CheckBoxProps {
  component?: any;
  checked?: boolean;
  iconRight?: boolean;
  title?: string | React.ReactElement;
  center?: boolean;
  right?: boolean;
  containerStyle?: unknown;
  textStyle?: unknown;
  onPress?(...args: unknown[]): unknown;
  onLongPress?(...args: unknown[]): unknown;
  checkedIcon?: string;
  uncheckedIcon?: string;
  iconType?: string;
  size?: number;
  checkedColor?: string;
  uncheckedColor?: string;
  checkedTitle?: string;
  onIconPress?(...args: unknown[]): unknown;
  onLongIconPress?(...args: unknown[]): unknown;
  fontFamily?: string;
}

export const CheckBox = (props: CheckBoxProps) => {
  const {
    component,
    checked,
    iconRight,
    title,
    center,
    right,
    containerStyle,
    textStyle,
    onPress,
    onLongPress,
    onIconPress,
    onLongIconPress,
    size,
    checkedIcon,
    uncheckedIcon,
    iconType,
    checkedColor,
    uncheckedColor,
    checkedTitle,
    fontFamily,
    ...attributes
  } = props;

  const Component = component || TouchableOpacity;
  let iconName = uncheckedIcon;
  if (checked) {
    iconName = checkedIcon;
  }

  return (
    <Component
      {...attributes}
      onLongPress={onLongPress}
      onPress={onPress}
      style={[styles.container, containerStyle && containerStyle]}
    >
      <View
        style={[
          styles.wrapper,
          right && { justifyContent: 'flex-end' },
          center && { justifyContent: 'center' },
        ]}
      >
        {!iconRight &&
          <Icon
            color={checked ? checkedColor : uncheckedColor}
            name={iconName}
            size={size || 24}
            onLongPress={onLongIconPress}
            onPress={onIconPress}
          />}

        {React.isValidElement(title)
          ? title
          : <Text
            style={[
              styles.text,
              textStyle && textStyle,
              fontFamily && { fontFamily },
            ]}
          >
            {checked ? checkedTitle || title : title}
          </Text>}

        {iconRight &&
          <Icon
            color={checked ? checkedColor : uncheckedColor}
            name={iconName}
            size={size || 24}
            onLongPress={onLongIconPress}
            onPress={onIconPress}
          />}
      </View>
    </Component>
  );
};

CheckBox.defaultProps = {
  checked: false,
  iconRight: false,
  right: false,
  center: false,
  checkedColor: 'green',
  uncheckedColor: '#bfbfbf',
  checkedIcon: 'check-square-o',
  uncheckedIcon: 'square-o',
  size: 24,
};

CheckBox.propTypes = {
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style
};
