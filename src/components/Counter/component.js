import * as React from 'react';
import { PropTypes } from 'prop-types';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export class Counter extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    initialValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    onValueChanged: PropTypes.func,
    progressCounter: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
    maxValue: undefined,
    minValue: 0,
    onValueChanged: () => {},
    progressCounter: false,
  }

  state = {
    manualEditMode: false,
    value: this.props.initialValue,
  };

  onManualValueChanged = (value) => {
    this.setState({
      manualEditValue: parseInt(value, 10),
    });
  }

  activateManualEdit = () => {
    this.setState({
      manualEditMode: true,
    });
  }

  deactivateManualEdit = () => {
    const { manualEditValue } = this.state;
    const { maxValue, minValue } = this.props;
    let { value } = this.state;
    if (manualEditValue >= minValue && manualEditValue <= maxValue) {
      value = manualEditValue;
    }

    this.setState({
      manualEditMode: false,
      value,
    });

    this.props.onValueChanged(value);
  }

  decrementCount = () => {
    const value = this.state.value - 1;

    if (value < this.props.minValue) {
      return;
    }

    this.setState({ value });
    this.props.onValueChanged(value);
  }

  incrementCount = () => {
    const value = this.state.value + 1;

    if (value > this.props.maxValue) {
      return;
    }

    this.setState({ value });
    this.props.onValueChanged(value);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={this.decrementCount}
          style={[styles.counterButton, styles.counterButtonLeft]}
        >
          <Text>-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.counterStatusContainer} onPress={this.activateManualEdit}>
          {this.state.manualEditMode
            ? (
              <TextInput
                style={styles.manualEditTextInput}
                defaultValue={this.state.value.toString()}
                placeholder={this.state.value.toString()}
                underlineColorAndroid="transparent"
                onBlur={this.deactivateManualEdit}
                onChangeText={this.onManualValueChanged}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.statusText}>{this.state.value}</Text>
            )
          }
          {this.props.progressCounter && <Text style={styles.progressText}>{` of ${this.props.maxValue}`}</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={this.incrementCount}
          style={[styles.counterButton, styles.counterButtonRight]}
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
