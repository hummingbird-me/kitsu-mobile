import * as React from 'react';
import { PropTypes } from 'prop-types';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonStyles } from 'kitsu/common/styles';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

export class SearchBox extends React.PureComponent {
  static propTypes = {
    containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    defaultValue: PropTypes.string,
    onChangeText: PropTypes.func,
    placeholder: PropTypes.string,
    searchIconOffset: PropTypes.number,
    value: PropTypes.string,
  };

  static defaultProps = {
    containerStyle: {},
    defaultValue: '',
    onChangeText: () => {},
    placeholder: 'Search',
    searchIconOffset: 80,
    value: '',
  };

  render() {
    const { defaultValue, onChangeText, placeholder, searchIconOffset, value } = this.props;

    return (
      <View style={[styles.searchContainer, this.props.containerStyle]}>
        <Icon
          name="search"
          style={[
            styles.searchIcon,
            commonStyles.colorLightGrey,
            { paddingRight: searchIconOffset },
            value && styles.searchIconFocus,
          ]}
        />
        <TextInput
          {...this.props}
          onChangeText={onChangeText}
          placeholder={placeholder}
          style={[commonStyles.text, commonStyles.colorLightGrey, styles.input]}
          underlineColorAndroid="transparent"
          defaultValue={defaultValue}
          value={value}
          autoCapitalize={'none'}
          autoCorrect={false}
          placeholderTextColor={colors.placeholderGrey}
          keyboardAppearance={'dark'}
        />
      </View>
    );
  }
}
