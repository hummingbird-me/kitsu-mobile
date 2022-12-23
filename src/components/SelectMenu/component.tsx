import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import ActionSheet from 'react-native-actionsheet';

import * as colors from 'kitsu/constants/colors';

interface SelectMenuProps {
  cancelButtonIndex?: number;
  activeOpacity?: number;
  children?: React.ReactElement;
  disabled?: boolean;
  options: string | object[];
  onOptionSelected(...args: unknown[]): unknown;
  style?: any;
  tintColor?: string;
}

export class SelectMenu extends React.PureComponent<SelectMenuProps> {
  static defaultProps = {
    cancelButtonIndex: -1,
    activeOpacity: 1,
    children: undefined,
    disabled: false,
    style: null,
    tintColor: colors.black,
  };

  getCancelButtonIndex() {
    return this.props.cancelButtonIndex > -1
      ? this.props.cancelButtonIndex
      : this.props.options.length - 1;
  }

  setActionSheet = (component) => {
    this.ActionSheet = component;
  };

  displayOptions = () =>
    this.props.options.map((option) => {
      if (typeof option === 'string') {
        return option.charAt(0).toUpperCase() + option.slice(1);
      }

      return option.text;
    });

  handleFilterChange = (selectedIndex) => {
    const cancelButtonIndex = this.getCancelButtonIndex();

    if (selectedIndex !== cancelButtonIndex) {
      const option = this.props.options[selectedIndex];

      if (typeof option === 'object') {
        this.props.onOptionSelected(option.value, option);
      } else {
        this.props.onOptionSelected(option);
      }
    }
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={this.props.activeOpacity}
        disabled={this.props.disabled}
        onPress={this.showActionSheet}
        style={this.props.style}
      >
        {this.props.children}
        <ActionSheet
          cancelButtonIndex={this.getCancelButtonIndex()}
          onPress={this.handleFilterChange}
          options={this.displayOptions()}
          ref={this.setActionSheet}
          tintColor={this.props.tintColor}
        />
      </TouchableOpacity>
    );
  }
}
