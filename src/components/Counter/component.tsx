import { isFinite, isNil } from 'lodash';
import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

type CounterProps = {
  disabled?: boolean;
  initialValue: number;
  value?: number;
  maxValue?: number;
  minValue?: number;
  onValueChanged?(...args: unknown[]): unknown;
  progressCounter?: boolean;
  inputRef?(...args: unknown[]): unknown;
};

type CounterState =
  | {
      manualEditMode: false;
      value: number | null;
    }
  | {
      manualEditMode: true;
      manualEditValue: number;
      value: number | null;
    };

export class Counter extends React.PureComponent<CounterProps, CounterState> {
  static defaultProps = {
    disabled: false,
    maxValue: undefined,
    minValue: 0,
    value: null,
    onValueChanged: () => {},
    progressCounter: false,
    inputRef: () => {},
  };

  state: CounterState = {
    manualEditMode: false,
    value: this.props.initialValue,
  };

  UNSAFE_componentWillReceiveProps({ value }: { value?: number }) {
    if (!isNil(value) && value !== this.state.value) {
      this.setState({ value });
    }
  }

  onManualValueChanged = (value: string) => {
    const newValue = parseInt(value, 10);
    const current = this.state.value || 0;
    this.setState({
      ...this.state,
      manualEditValue: isFinite(newValue) ? newValue : current,
    });
  };

  activateManualEdit = () => {
    this.setState({
      ...this.state,
      manualEditMode: true,
      manualEditValue: this.state.value || 0,
    });
  };

  deactivateManualEdit = () => {
    if (this.state.manualEditMode === false) return;

    const { manualEditValue } = this.state;
    const { maxValue, minValue } = this.props;
    let { value } = this.state;

    // Check for boundary values
    if (!isNil(minValue) && manualEditValue < minValue) {
      value = minValue;
    } else if (!isNil(maxValue) && manualEditValue > maxValue) {
      value = maxValue;
    } else {
      value = manualEditValue;
    }

    this.setState({
      manualEditMode: false,
      value,
    });

    this.props.onValueChanged?.(value);
  };

  decrementCount = () => {
    const value = (this.state.value || 0) - 1;

    if (!isNil(this.props.minValue) && value < this.props.minValue) {
      return;
    }

    this.setState({ value });
    this.props.onValueChanged?.(value);
  };

  incrementCount = () => {
    const value = (this.state.value || 0) + 1;

    if (!isNil(this.props.maxValue) && value > this.props.maxValue) {
      return;
    }

    this.setState({ value });
    this.props.onValueChanged?.(value);
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={this.decrementCount}
          style={[styles.counterButton, styles.counterButtonLeft]}>
          <Text>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={this.props.disabled}
          style={styles.counterStatusContainer}
          onPress={this.activateManualEdit}>
          {this.state.manualEditMode ? (
            <TextInput
              ref={this.props.inputRef}
              autoFocus
              style={styles.manualEditTextInput}
              defaultValue={this.state.value?.toString()}
              placeholder={this.state.value?.toString()}
              underlineColorAndroid="transparent"
              onBlur={this.deactivateManualEdit}
              onChangeText={this.onManualValueChanged}
              keyboardType="numeric"
            />
          ) : (
            <Text style={styles.statusText}>{this.state.value}</Text>
          )}
          {this.props.progressCounter && (
            <Text
              style={styles.progressText}>{` of ${this.props.maxValue}`}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={this.incrementCount}
          style={[styles.counterButton, styles.counterButtonRight]}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
