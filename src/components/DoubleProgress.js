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

    const textStyle = { color: '#565656', fontWeight: '600' };
    console.log(leftProgress > rightProgress);
    console.log(leftProgress < rightProgress);

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
        <View style={{ width: '20%' }}>
          <Text
            style={{
              ...textStyle,
              color: leftProgress < rightProgress ? '#D1D1D1' : textStyle.color,
            }}
          >
            {left}
          </Text>
        </View>
        <Body style={{ flexDirection: 'row', width: '60%', justifyContent: 'center' }}>
          <Progress.Bar
            progress={leftProgress}
            width={width * 0.20}
            borderRadius={0}
            height={10}
            color={filledColor || '#00BEE0'}
            unfilledColor={unfilledColor || '#F0F0F0'}
            borderWidth={0}
            style={{
              borderTopRightRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
              transform: [{ rotate: '180deg' }],
            }}
            innerStyle={{
              borderTopRightRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
            }}
          />
          <Progress.Bar
            progress={rightProgress}
            width={width * 0.20}
            height={10}
            borderRadius={0}
            color={filledColor || '#FF6300'}
            unfilledColor={unfilledColor || '#F0F0F0'}
            borderWidth={0}
            style={{
              borderTopRightRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
            }}
            innerStyle={{
              borderTopRightRadius: borderRadius,
              borderBottomRightRadius: borderRadius,
            }}
          />
        </Body>
        <View style={{ width: '20%' }}>
          <Text
            style={{
              ...textStyle,
              color: leftProgress > rightProgress ? '#D1D1D1' : textStyle.color,
            }}
          >
            {right}
          </Text>
        </View>
      </View>
    );
  }
}

DoubleProgress.propTypes = {
  source: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default DoubleProgress;
