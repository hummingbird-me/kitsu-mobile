import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import ActionSheet from 'react-native-actionsheet';
import * as colors from 'kitsu/constants/colors';

export class SelectMenu extends PureComponent {
  static propTypes = {
    cancelButtonIndex: PropTypes.number,
    children: PropTypes.element,
    options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object]))
      .isRequired,
    onOptionSelected: PropTypes.func.isRequired,
    style: PropTypes.any,
    tintColor: PropTypes.string,
  };

  static defaultProps = {
    cancelButtonIndex: -1,
    children: undefined,
    style: null,
    tintColor: colors.black,
  };

  constructor(props) {
    super(props);

    this.displayOptions = props.options.map((option) => {
      if (typeof option === 'string') {
        return option.charAt(0).toUpperCase() + option.slice(1);
      }

      return option.text;
    });
  }

  getCancelButtonIndex() {
    return this.props.cancelButtonIndex > -1
      ? this.props.cancelButtonIndex
      : this.props.options.length - 1;
  }

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
      <TouchableOpacity activeOpacity={1} onPress={this.showActionSheet} style={this.props.style}>
        {this.props.children}
        <ActionSheet
          cancelButtonIndex={this.getCancelButtonIndex()}
          onPress={this.handleFilterChange}
          options={this.displayOptions}
          ref={(component) => {
            this.ActionSheet = component;
          }}
          tintColor={this.props.tintColor}
        />
      </TouchableOpacity>
    );
  }
}
