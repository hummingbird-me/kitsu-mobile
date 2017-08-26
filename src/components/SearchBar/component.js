import * as React from 'react';
import { PropTypes } from 'prop-types';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectSearchBox } from 'react-instantsearch/connectors';
import { commonStyles } from 'kitsu/common/styles';
import * as colors from 'kitsu/constants/colors';
import { styles } from './styles';

export const SearchBar = connectSearchBox(
  ({ refine, currentRefinement, placeholder, searchIconOffset }) => (
    <SearchBarPlain
      refine={refine}
      currentRefinement={currentRefinement}
      placeholder={placeholder}
      searchIconOffset={searchIconOffset}
    />
  ),
);

class SearchBarPlain extends React.PureComponent {
  static propTypes = {
    containerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    searchIconOffset: PropTypes.number,
  };

  static defaultProps = {
    containerStyle: {},
    defaultValue: '',
    onChangeText: () => {},
    placeholder: 'Search',
    searchIconOffset: 80,
  };

  render() {
    const { defaultValue, placeholder, searchIconOffset, currentRefinement, refine } = this.props;
    return (
      <View style={[styles.searchContainer, this.props.containerStyle]}>
        <Icon
          name="search"
          style={[
            styles.searchIcon,
            commonStyles.colorLightGrey,
            { paddingRight: searchIconOffset },
            currentRefinement && styles.searchIconFocus,
          ]}
        />
        <TextInput
          {...this.props}
          onChangeText={t => refine(t)}
          placeholder={placeholder}
          style={[commonStyles.text, commonStyles.colorLightGrey, styles.input]}
          underlineColorAndroid="transparent"
          defaultValue={defaultValue}
          value={currentRefinement}
          autoCapitalize={'none'}
          autoCorrect={false}
          placeholderTextColor={colors.placeholderGrey}
          keyboardAppearance={'dark'}
        />
      </View>
    );
  }
}
