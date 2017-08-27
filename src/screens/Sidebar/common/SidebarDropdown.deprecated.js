import React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { Text, Icon, Right } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { ItemSeparator } from './SidebarListItem';

const itemHeight = 0;
const dropdownItemHeight = 50;

const DropdownItem = ({ title, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => onPress(title)}
    style={{
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      height: dropdownItemHeight,
    }}
  >
    <Text style={{ fontFamily: 'OpenSans', fontSize: 12, marginHorizontal: 16, color: '#444' }}>
      {title}
    </Text>
  </TouchableOpacity>
);

class SidebarDropdown extends React.Component {
  state = {
    active: false,
  };

  count = this.props.options.length;
  height = new Animated.Value(itemHeight);

  toggle = () => {
    const nextVal = this.state.active ? itemHeight : dropdownItemHeight * this.count;
    Animated.spring(this.height, {
      toValue: nextVal,
    }).start(() => {});
    this.setState({ active: !this.state.active });
  };

  render() {
    const { title, value, options, onSelectOption } = this.props;
    return (
      <View>
        <TouchableOpacity activeOpacity={1} onPress={this.toggle} style={styles.sectionListItem}>
          <View>
            <Text
              style={{
                fontFamily: 'OpenSans',
                fontSize: 10,
                marginLeft: 8,
                color: colors.lightGrey,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: 'OpenSans',
                fontSize: 12,
                marginLeft: 8,
                marginTop: 4,
                color: '#444',
              }}
            >
              {value}
            </Text>
          </View>
          <Right>
            <Icon name={'ios-code'} style={{ color: colors.lightGrey, fontSize: 16 }} />
          </Right>
        </TouchableOpacity>
        <Animated.View
          style={{
            zIndex: 300,
            left: 0,
            right: 0,
            position: 'relative',
            backgroundColor: 'white',
            height: this.height,
          }}
        >
          {this.state.active &&
            options.map((option, i) => (
              <View key={`${i}dd`} style={{ height: 50 }}>
                <DropdownItem
                  onPress={() => {
                    onSelectOption(option);
                    this.toggle();
                  }}
                  title={option.title}
                />
                {options.length - 1 !== +i ? <ItemSeparator /> : null}
              </View>
            ))}
        </Animated.View>
      </View>
    );
  }
}

// SidebarDropdown.propTypes = {
//   title: PropTypes.string.isRequired,
//   onPress: PropTypes.func,
// };

// SidebarDropdown.defaultProps = {
//   title: 'Settings',
// };

const styles = {
  sectionListItem: {
    zIndex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 0,
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
    marginLeft: 0,
  },
};

export default SidebarDropdown;
