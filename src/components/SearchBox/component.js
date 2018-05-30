import * as React from 'react';
import { PropTypes } from 'prop-types';
import { TextInput, View, ViewPropTypes, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { commonStyles } from 'kitsu/common/styles';
import { isEmpty } from 'lodash';
import { styles } from './styles';

export class SearchBox extends React.PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    defaultValue: PropTypes.string,
    onChangeText: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    showClearButton: PropTypes.bool,
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
          style={[
            styles.searchIcon,
            commonStyles.colorLightGrey,
          ]}
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
        {showClearButton && !isEmpty(value) &&
          <TouchableOpacity style={styles.clearContainer} onPress={() => onChangeText('')}>
            <Icon
              name="ios-close-circle"
              style={[
                styles.clearIcon,
                commonStyles.colorLightGrey,
              ]}
              size={16}
            />
          </TouchableOpacity>
        }
      </View>
    );
  }
}
