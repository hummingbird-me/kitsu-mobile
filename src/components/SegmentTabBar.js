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
          color: colors.dark,
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
  textStyles(index) {
    if (index === this.props.activeTab){
      return {
        color: colors.tabbarSelectedTextColor,
        fontFamily: 'OpenSans',
        fontWeight: '600',
        opacity: 1,
        fontSize: 12,
      }
    }
    else {
      return {
      color: '#ffffff',
      fontFamily: 'OpenSans',
      fontWeight: '600',
      opacity: 0.6,
      fontSize: 12,
      }
    }
  },
  render() {
    return (
      <StyleProvider style={getTheme(kitsuStyles)}>
        <Segment
          style={{
            backgroundColor: colors.listBackPurple,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            borderRightWidth: 0,
            borderLeftWidth: 0,
            height: 40,
            paddingRight: 5,
            paddingLeft: 5,
            shadowColor: 'black',
            shadowOpacity: 0.1,
            shadowRadius: StyleSheet.hairlineWidth,
            marginRight: 28,
            marginLeft: 28,
          }}
        >
          {this.props.tabs.map((tab, i) => (
            <Button transparent
              key={tab}
              onPress={() => this.props.goToPage(i)}
              style={{
                height: 27,
                marginTop: 0,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderBottomWidth: 0,
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
              }}
              last={this.props.tabs.length - 1 === i}
              first={i === 0}
            >
              <Text style={this.textStyles(i)}>{tab}</Text>
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
