import * as React from 'react';
import { PropTypes } from 'prop-types';
import { TextInput, View, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonStyles } from 'kitsu/common/styles';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

export class SearchBox extends React.PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    defaultValue: PropTypes.string,
    onChangeText: PropTypes.func,
    placeholder: PropTypes.string,
    searchIconOffset: PropTypes.number,
    value: PropTypes.string,
  };

  static defaultProps = {
    defaultValue: '',
    onChangeText: () => {},
    placeholder: 'Search',
    searchIconOffset: 80,
    style: null,
    value: '',
  };

  render() {
    const { defaultValue, onChangeText, placeholder, searchIconOffset, value } = this.props;

    return (
      <View style={[styles.searchContainer, this.props.style]}>
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
          style={[commonStyles.text, styles.input]}
          underlineColorAndroid="transparent"
          defaultValue={defaultValue}
          value={value}
          autoCapitalize={'none'}
          autoCorrect={false}
          keyboardAppearance={'dark'}
        />
      </View>
    );
  }
}
