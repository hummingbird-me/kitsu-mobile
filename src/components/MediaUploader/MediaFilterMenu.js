import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Body, Card, CardItem } from 'native-base';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as colors from 'kitsu/constants/colors';

export default class MediaFilterMenu extends Component {
  static propTypes = {
    filterContext: PropTypes.string.isRequired,
    onFilterContextChanged: PropTypes.func.isRequired,
  }

  renderMenuItem = (text) => {
    const selected = text === this.props.filterContext;

    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => this.props.onFilterContextChanged(text)}
      >
        <Text style={styles.menuItemText}>{text}</Text>
        { selected && <Icon name="check" style={styles.selectedIcon} />}
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Card style={styles.modal}>
        <CardItem>
          <Body>
            {this.renderMenuItem('Camera Roll')}
            <View style={styles.separator} />
            {this.renderMenuItem('Photo Stream')}
          </Body>
        </CardItem>
      </Card>
    );
  }
}

const styles = {
  modal: {
    position: 'absolute',
    flex: 1,
    top: -3,
    left: '50%',
    marginLeft: -100,
    width: 200,
  },
  separator: {
    width: '100%',
    height: 0.5,
    marginVertical: 5,
    backgroundColor: colors.darkGrey,
  },
  menuItem: {
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  menuItemText: {
    fontFamily: 'OpenSans',
  },
  selectedIcon: {
    color: colors.activeRed,
    fontSize: 16,
  },
};
