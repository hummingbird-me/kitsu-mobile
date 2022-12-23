import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import ActionSheet from 'react-native-actionsheet';

import styles from './styles';

const OPTIONS = ['all', 'anime', 'manga', 'nevermind'];

export default class HeaderFilterButton extends PureComponent {
  static propTypes = {
    mode: PropTypes.oneOf(OPTIONS).isRequired,
    onModeChanged: PropTypes.func.isRequired,
    style: PropTypes.any,
  };

  static defaultProps = {
    style: null,
  };

  // Right now, just uppercases first letter, but could easily be more complicated
  // if necessary later.
  textForMode = mode => mode.charAt(0).toUpperCase() + mode.slice(1);

  handleFilterChange = (index) => {
    const selectedMode = OPTIONS[index];

    if (selectedMode !== 'cancel' && selectedMode !== this.props.mode) {
      this.props.onModeChanged(selectedMode);
    }
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  render() {
    const { mode } = this.props;

    if (!mode) return null;

    return (
      <View {...this.props} style={[styles.wrapper, this.props.style]}>
        <TouchableOpacity onPress={this.showActionSheet}>
          <Icon style={styles.icon} name="dots-horizontal" />
          <ActionSheet
            ref={(component) => {
              this.ActionSheet = component;
            }}
            options={OPTIONS.map(this.textForMode)}
            onPress={this.handleFilterChange}
            cancelButtonIndex={OPTIONS.length - 1}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
