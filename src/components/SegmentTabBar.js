import React from 'react';
import { StyleSheet } from 'react-native';
import { Segment, Button, Text, StyleProvider, View } from 'native-base';
import getTheme from '../../native-base-theme/components';
import kitsuStyles from '../../native-base-theme/variables/kitsu';
import * as colors from '../constants/colors';

const SegmentTabBar = React.createClass({
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
      <StyleProvider style={getTheme(kitsuStyles)}>
        <Segment
          style={{
            backgroundColor: colors.darkPurple,
            borderTopWidth: 0,
            height: 40,
            paddingRight: 5,
            paddingLeft: 5,
            shadowColor: 'black',
            shadowOpacity: 0.1,
            shadowRadius: StyleSheet.hairlineWidth,
          }}
        >
          {this.props.tabs.map((tab, i) => (
            <Button
              key={tab}
              onPress={() => this.props.goToPage(i)}
              style={{
                height: 27,
                marginTop: 0,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              active={this.props.activeTab === i}
              last={this.props.tabs.length - 1 === i}
              first={i === 0}
            >
              <Text>{tab}</Text>
            </Button>
          ))}
        </Segment>
      </StyleProvider>
    );
  },
});
// <TouchableOpacity style={styles.tab}>
//   <Icon
//     name={tab}
//     size={30}
//     color={this.props.activeTab === i ? 'rgb(59,89,152)' : 'rgb(204,204,204)'}
//     ref={(icon) => {
//       this.tabIcons[i] = icon;
//     }}
//   />
// </TouchableOpacity>

export default SegmentTabBar;
