import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SimpleHeader } from 'kitsu/components/SimpleHeader';
import { styles } from './styles';
import { Navigation } from 'react-native-navigation';

interface NavigationHeaderProps {
  navigation?: object;
  componentId?: any;
  leftIcon?: string;
  rightIcon?: string;
  title?: string;
}

export const NavigationHeader = ({
  navigation,
  title,
  leftIcon,
  rightIcon,
  componentId,
  ...props
}: NavigationHeaderProps) => (
  <SimpleHeader
    titleContent={title}
    leftContent={leftIcon ? <Icon name={leftIcon} style={[styles.icon, { fontSize: 16 }]} /> : null}
    leftAction={() => {
      if (componentId) {
        Navigation.pop(componentId);
      }
    }}
    rightContent={rightIcon ? <Icon name={rightIcon} style={styles.icon} /> : null}
    {...props}
  />
);

NavigationHeader.defaultProps = {
  navigation: null,
  componentId: null,
  title: '',
  leftIcon: 'chevron-left',
  rightIcon: null,
};
