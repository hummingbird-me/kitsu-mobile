import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, View } from 'native-base';
import * as colors from '../constants/colors';

const SimpleTabBar = React.createClass({
  tabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
  },

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  },

  setAnimationValue({ value }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = Math.min(1, Math.abs(value - i));
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  },

  // color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (204 - 59) * progress;
    const green = 89 + (204 - 89) * progress;
    const blue = 152 + (204 - 152) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  },

  render() {
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          borderBottomWidth: 1,
          borderColor: '#EEEEEE',
          padding: 5,
          shadowColor: 'black',
          shadowOpacity: 0.1,
          shadowRadius: StyleSheet.hairlineWidth,
          flexDirection: 'row',
        }}
      >
        {this.props.tabs.map((tab, i) => (
          <Button
            key={tab}
            transparent
            onPress={() => this.props.goToPage(i)}
            style={{
              height: 27,
              marginTop: 0,
              marginRight: 1,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRightWidth: this.props.tabs.length - 1 === i ? 0 : 1,
              borderRightColor: '#eee',
              borderRadius: 0,
            }}
          >
            <Text
              style={{
                fontFamily: 'OpenSans',
                fontSize: 12,
                fontWeight: '600',
                color: this.props.activeTab === i ? '#FF4027' : '#333333',
              }}
            >
              {tab}
            </Text>
          </Button>
        ))}
      </View>
    );
  },
});

const styles = {
  footerDivider: {
    width: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
  },
};

export default SimpleTabBar;
