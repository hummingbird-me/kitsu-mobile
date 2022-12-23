import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { commonStyles } from 'kitsu/common/styles';

import { styles } from './styles';

interface SearchBoxProps {
  style?: unknown;
  defaultValue?: string;
  onChangeText?(...args: unknown[]): unknown;
  placeholder?: string;
  value?: string;
  showClearButton?: boolean;
}

export class SearchBox extends React.PureComponent<SearchBoxProps> {
  static propTypes = {
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    defaultValue: '',
    onChangeText: () => {},
    placeholder: 'Search',
    style: null,
    value: '',
    showClearButton: true,
  };

  render() {
    const { value, onChangeText, showClearButton, ...restProps } = this.props;

    return (
      <View style={[styles.searchContainer, this.props.style]}>
        <Icon
          name="ios-search"
          style={[styles.searchIcon, commonStyles.colorLightGrey]}
          size={18}
        />
        <TextInput
          {...restProps}
          value={value}
          style={[commonStyles.text, styles.input]}
          onChangeText={onChangeText}
          underlineColorAndroid="transparent"
          autoCapitalize={'none'}
          autoCorrect={false}
          keyboardAppearance={'dark'}
        />
        {showClearButton && !isEmpty(value) && (
          <TouchableOpacity
            style={styles.clearContainer}
            onPress={() => onChangeText('')}
          >
            <Icon
              name="ios-close-circle"
              style={[styles.clearIcon, commonStyles.colorLightGrey]}
              size={16}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
