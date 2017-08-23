import * as React from 'react';
import { PropTypes } from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { commonStyles } from 'kitsu/common/styles';
import { styles } from './styles';

export class Counter extends React.PureComponent {
  static propTypes = {
    initialValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number,
    minValue: PropTypes.number,
    onValueChanged: PropTypes.func,
    progressCounter: PropTypes.bool,
  }

  static defaultProps = {
    maxValue: undefined,
    minValue: 0,
    onValueChanged: () => {},
    progressCounter: true,
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.initialValue,
    };
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
          onPress={this.decrementCount}
          style={[styles.counterButton, styles.counterButtonLeft]}
        >
          <Text>-</Text>
        </TouchableOpacity>

        <View style={styles.counterStatusContainer}>
          <Text style={styles.statusText}>{this.state.value}</Text>
          {this.props.progressCounter && <Text style={styles.progressText}>{` of ${this.props.maxValue}`}</Text>}
        </View>

        <TouchableOpacity
          onPress={this.incrementCount}
          style={[styles.counterButton, styles.counterButtonRight]}
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
