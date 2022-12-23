import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import ActionSheet from 'react-native-actionsheet';
import * as colors from 'kitsu/constants/colors';

export class SelectMenu extends React.PureComponent {
  static propTypes = {
    cancelButtonIndex: PropTypes.number,
    activeOpacity: PropTypes.number,
    children: PropTypes.element,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ])).isRequired,
    onOptionSelected: PropTypes.func.isRequired,
    style: PropTypes.any,
    tintColor: PropTypes.string,
  };

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

  displayOptions = () => this.props.options.map((option) => {
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
