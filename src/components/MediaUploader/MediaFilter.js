import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as colors from 'kitsu/constants/colors';

export default class MediaFilter extends PureComponent {
  static propTypes = {
    filterContext: PropTypes.string,
    onPress: PropTypes.func,
  }

  static defaultProps = {
    filterContext: 'Camera Roll',
    onPress: () => {},
  }

  render() {
    const { filterContext } = this.props;

    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.wrapper}>
        <Text style={styles.filterContext}>{filterContext}</Text>
        <Text style={styles.instructions}>Tap here to change <Icon name="chevron-down" /></Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    width: '120%', // We need to overflow our parent, as we're actually wider than we technically should be.
    height: 45,
  },
  filterContext: {
    color: colors.white,
    fontFamily: 'OpenSans',
    fontWeight: '800',
    fontSize: 13,
    textAlign: 'center',
  },
  instructions: {
    color: colors.lightGrey,
    fontFamily: 'OpenSans',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
