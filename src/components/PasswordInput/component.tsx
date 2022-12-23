import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Input } from 'kitsu/components/Input';

import { styles } from './styles';

interface PasswordInputProps {
  value?: string;
  onChangeText?(...args: unknown[]): unknown;
}

export class PasswordInput extends PureComponent<PasswordInputProps> {
  static defaultProps = {
    value: '',
    onChangeText: null,
  };

  state = {
    passwordVisible: false,
  };

  toggleVisibility = () => {
    this.setState({
      passwordVisible: !this.state.passwordVisible,
    });
  };

  render() {
    const { value, onChangeText, ...props } = this.props;
    const { passwordVisible } = this.state;
    return (
      <View style={styles.container}>
        <Input
          containerStyle={styles.input}
          {...props}
          secureTextEntry={!passwordVisible}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.toggle} onPress={this.toggleVisibility}>
          <Icon
            name={passwordVisible ? 'eye' : 'eye-slash'}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
