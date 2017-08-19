import * as React from 'react';
import { PropTypes } from 'prop-types';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonStyles } from 'kitsu/common/styles';
import { styles } from './styles';

export class SearchBar extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hasFocus: false,
      value: props.defaultValue,
    };

    console.log(props);
  }

  onChangeText = (value) => {
    this.setState({ value });
    this.props.onChangeText(value);
  }

  render() {
    return (
      <View style={[styles.searchContainer, this.props.containerStyle]}>
        <Icon
          name="search"
          style={[
            styles.searchIcon,
            commonStyles.colorLightGrey,
            (this.state.value && styles.searchIconFocus),
          ]}
        />
        <TextInput
          {...this.props}
          onChangeText={this.onChangeText}
          style={[
            commonStyles.text,
            commonStyles.colorLightGrey,
            styles.input,
          ]}
        />
      </View>
    );
  }
}

SearchBar.propTypes = {
  defaultValue: PropTypes.string,
  onChangeText: PropTypes.func,
  containerStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
  ]),
};

SearchBar.defaultProps = {
  defaultValue: '',
  onChangeText: () => {},
  containerStyle: {},
};
