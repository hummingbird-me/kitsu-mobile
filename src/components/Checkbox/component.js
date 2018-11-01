import PropTypes from 'prop-types';
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ViewPropTypes,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from './styles';

export const CheckBox = (props) => {
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
  component: PropTypes.any,
  checked: PropTypes.bool,
  iconRight: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  center: PropTypes.bool,
  right: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  checkedIcon: PropTypes.string,
  uncheckedIcon: PropTypes.string,
  iconType: PropTypes.string,
  size: PropTypes.number,
  checkedColor: PropTypes.string,
  uncheckedColor: PropTypes.string,
  checkedTitle: PropTypes.string,
  onIconPress: PropTypes.func,
  onLongIconPress: PropTypes.func,
  fontFamily: PropTypes.string,
};
