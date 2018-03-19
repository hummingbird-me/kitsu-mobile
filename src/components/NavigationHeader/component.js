import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as PropTypes from 'prop-types';
import { SimpleHeader } from 'kitsu/components/SimpleHeader';
import { styles } from './styles';

export const NavigationHeader = ({ navigation, title, leftIcon, rightIcon, ...props }) => (
  <SimpleHeader
    titleContent={title}
    leftContent={leftIcon ? <Icon name={leftIcon} style={[styles.icon, { fontSize: 16 }]} /> : null}
    leftAction={() => navigation.goBack(null)}
    rightContent={rightIcon ? <Icon name={rightIcon} style={styles.icon} /> : null}
    {...props}
  />
);

NavigationHeader.propTypes = {
  navigation: PropTypes.object.isRequired,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  title: PropTypes.string,
};

NavigationHeader.defaultProps = {
  title: '',
  leftIcon: 'chevron-left',
  rightIcon: null,
};
