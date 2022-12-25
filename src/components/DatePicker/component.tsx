import React, { PureComponent } from 'react';
import {
  Animated,
  DatePickerAndroid,
  DatePickerAndroidOpenReturn,
  DatePickerIOS,
  Keyboard,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { styles } from './styles';

type DatePickerProps = {
  duration?: number;
  style?: object;
  disabled?: boolean;
};

type DatePickerState = {
  modalVisible: boolean;
  animatedHeight: Animated.Value;
  allowPointerEvents: boolean;
  date?: Date;
  minDate?: Date;
  maxDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
};

export class DatePicker extends PureComponent<
  DatePickerProps,
  DatePickerState
> {
  static defaultProps = {
    duration: 300,
    style: null,
    disabled: false,
  };

  state: DatePickerState = {
    modalVisible: false,
    animatedHeight: new Animated.Value(0),
    allowPointerEvents: true,
  };

  /**
   * Show the date picker.
   *
   * @param {Date} initial The initial date.
   * @param {Date} [min=null] The minimum date.
   * @param {Date} [max=null] The maximum date.
   * @param {function} [onDateChange=null] The callback function when date change is confirmed.
   */
  async show(
    initial: Date,
    min?: Date,
    max?: Date,
    onDateChange?: (date: Date | undefined) => void
  ) {
    if (this.props.disabled) return;

    Keyboard.dismiss();

    // Default the date values to null
    const minDate = min instanceof Date ? min : undefined;
    const maxDate = max instanceof Date ? max : undefined;

    // reset state
    this.setState(
      {
        date: this._getDate(initial, minDate, maxDate),
        minDate,
        maxDate,
        onDateChange,
      },
      async () => {
        if (Platform.OS === 'ios') {
          this._setModalVisible(true);
        } else {
          try {
            const selection = await DatePickerAndroid.open({
              date: this.state.date,
              minDate,
              maxDate,
            });
            this._onDatePicked(selection);
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  }

  // Get the `date` bounded by `minDate` and `maxDate`
  _getDate(
    date?: Date,
    minDate: Date | undefined = this.state.minDate,
    maxDate: Date | undefined = this.state.maxDate
  ) {
    // If no date is provided then use current date
    // Make sure we constrain it to the min and max
    const current = date instanceof Date ? date : new Date();

    if (minDate && current < minDate) {
      return minDate;
    }

    if (maxDate && current > maxDate) {
      return maxDate;
    }

    return current;
  }

  // Confirm the date
  _datePicked() {
    const { onDateChange, date } = this.state;
    if (onDateChange) {
      onDateChange(date);
    }
  }

  _resetState() {
    this.setState({
      date: undefined,
      minDate: undefined,
      maxDate: undefined,
      onDateChange: undefined,
    });
  }

  _onPressCancel = () => {
    this._setModalVisible(false);
    this._resetState();
  };

  _onPressConfirm = () => {
    this._datePicked();
    this._setModalVisible(false);
    this._resetState();
  };

  // iOS: callback
  _setDate = (date: Date | undefined) => {
    this.setState({
      allowPointerEvents: false,
      date,
    });
    const timeoutId = setTimeout(() => {
      this.setState({
        allowPointerEvents: true,
      });
      clearTimeout(timeoutId);
    }, 200);
  };

  // Android: Callback
  _onDatePicked({ action, year, month, day }: DatePickerAndroidOpenReturn) {
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState(
        {
          date: new Date(year, month, day),
        },
        () => {
          this._datePicked();
          this._resetState();
        }
      );
    } else {
      this._onPressCancel();
    }
  }

  // iOS: Show the modal
  _setModalVisible(visible: boolean) {
    const { duration } = this.props;

    // 216 (date picker height) + 42 (top bar height)
    const height = 258;

    // slide animation
    if (visible) {
      this.setState({ modalVisible: visible });
      return Animated.timing(this.state.animatedHeight, {
        toValue: height,
        duration,
        useNativeDriver: true,
      }).start();
    }

    return Animated.timing(this.state.animatedHeight, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalVisible: visible });
    });
  }

  render() {
    if (Platform.OS === 'android') return null;

    const { style } = this.props;
    const {
      modalVisible,
      allowPointerEvents,
      animatedHeight,
      date,
      minDate,
      maxDate,
    } = this.state;

    return (
      <Modal
        transparent
        animationType="none"
        visible={modalVisible}
        onRequestClose={() => {
          this._setModalVisible(false);
        }}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={this._onPressCancel}>
          <Animated.View
            style={[styles.dateContainer, style, { height: animatedHeight }]}>
            <TouchableOpacity style={styles.buttonContainer} activeOpacity={1}>
              <TouchableOpacity
                onPress={this._onPressCancel}
                style={styles.button}>
                <Text style={styles.text}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.text, styles.title]}>Select a Date</Text>
              <TouchableOpacity
                onPress={this._onPressConfirm}
                style={styles.button}>
                <Text style={[styles.text, styles.confirm]}>Confirm</Text>
              </TouchableOpacity>
            </TouchableOpacity>
            <View pointerEvents={allowPointerEvents ? 'auto' : 'none'}>
              <DatePickerIOS
                style={styles.datePicker}
                mode="date"
                date={date || new Date()}
                minimumDate={minDate}
                maximumDate={maxDate}
                onDateChange={this._setDate}
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  }
}
