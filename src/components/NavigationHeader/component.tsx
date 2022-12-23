import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as PropTypes from 'prop-types';
import { SimpleHeader } from 'kitsu/components/SimpleHeader';
import { styles } from './styles';
import { Navigation } from 'react-native-navigation';

export const NavigationHeader = ({ navigation, title, leftIcon, rightIcon, componentId, ...props }) => (
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

NavigationHeader.propTypes = {
  navigation: PropTypes.object,
  componentId: PropTypes.any,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  title: PropTypes.string,
};

NavigationHeader.defaultProps = {
  navigation: null,
  componentId: null,
  title: '',
  leftIcon: 'chevron-left',
  rightIcon: null,
};
