import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
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
        <View style={{ width: '15%' }}>
          <Text
            style={{
              ...textStyle,
              fontSize: 12
            }}
          >
            {left}
          </Text>
        </View>
        <Body style={{ flexDirection: 'row', width: '60%', justifyContent: 'center' }}>
          <Progress.Bar
            progress={leftProgress}
            width={width * 0.25}
            borderRadius={0}
            height={6}
            color={filledColor || '#00BEE0'}
            unfilledColor={unfilledColor || '#F0F0F0'}
            borderWidth={0}
            style={{
              transform: [{ rotate: '180deg' }],
              borderRadius: 0,
            }}
            innerStyle={{
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3,
            }}
          />
          <Progress.Bar
            progress={rightProgress}
            width={width * 0.25}
            height={6}
            color={filledColor || '#FF6300'}
            unfilledColor={unfilledColor || '#F0F0F0'}
            borderWidth={0}
            style={{
              borderRadius: 0,
            }}
            innerStyle={{
              borderTopLeftRadius: 3,
              borderBottomLeftRadius: 3,
            }}
          />
        </Body>
        <View style={{ width: '15%' }}>
          <Text
            style={{
              ...textStyle,
              fontSize: 10,
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
