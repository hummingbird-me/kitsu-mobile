import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions } from 'react-native';
var ProgressBar = require('react-native-animated-progress-bar');
import { Button, Container, Content, Icon, Left, Right, Body } from 'native-base';

const { width } = Dimensions.get('window');

class DoubleProgress extends Component {
  render() {
    const { left, right, leftProgress, rightProgress, filledColor, unfilledColor } = this.props;
    const borderRadius = 6;

    const textStyle = { color: 'rgb(51, 51, 51)', fontFamily: 'OpenSans'};

    return (
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 0,
          paddingRight: 0,
          marginBottom: 5,
          marginTop: 5,
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
        <View style={{ width: '18%' }}>
          <Text
            style={{
              ...textStyle,
              fontSize: 10
            }}
          >
            {left}
          </Text>
        </View>
        <Body style={{ flexDirection: 'row', width: '60%', justifyContent: 'center' }}>
          <ProgressBar
            progress={leftProgress}
            backgroundStyle={{backgroundColor:'#F0F0F0', borderTopRightRadius: 3, borderBottomRightRadius: 3, width: width*0.25, height: 6, padding: 0, transform: [{rotate: '180deg'}]}}
            progressStyle={{borderTopLeftRadius: 3, borderBottomLeftRadius: 3, backgroundColor: filledColor || '#00BEE0', height: 6, transform: [{rotate: '180deg'}]}}
            incompleteStyle={{backgroundColor: unfilledColor || '#F0F0F0', height: 6, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, transform: [{rotate: '180deg'}]}}
          />
          <ProgressBar
            progress={rightProgress}
            backgroundStyle={{backgroundColor:'#F0F0F0', borderTopRightRadius: 3, borderBottomRightRadius: 3, width: width*0.25, height: 6, padding: 0}}
            progressStyle={{borderTopRightRadius: 3, borderBottomRightRadius: 3, backgroundColor: filledColor || '#FF6300', height: 6}}
            incompleteStyle={{backgroundColor: unfilledColor || '#F0F0F0', height: 6, borderTopRightRadius: 3, borderBottomRightRadius: 3 }}
          />
        </Body>
        <View style={{ width: '18%'}}>
          <Text
            style={{
              ...textStyle,
              fontSize: 10,
              marginLeft: 9
            }}
          >
            {right}
          </Text>
        </View>
      </View>
    );
  }
}


export default DoubleProgress;
