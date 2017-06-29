import React from 'react';
import { View, Dimensions, Text, Image } from 'react-native';
import { Button, Icon, Left, Right } from 'native-base';

import LinearGradient from 'react-native-linear-gradient';

const CustomHeader = ({ navigation, headerImage, right, left, leftText, rightText }) => {
  const rightBtn = (
    <Button
      style={{
        height: 20,
        width: 83,
        backgroundColor: '#16A085',
        justifyContent: 'center',
        marginRight: 10,
        zIndex: 100,
      }}
      small
      success
      onPress={() => navigation.goBack()}
    >
      <Text style={{ color: 'white', fontSize: 10 }}>Follow</Text>
    </Button>
  );
  const leftBtn = (
    <Button transparent color="white" onPress={() => navigation.goBack()}>
      <Icon name="arrow-back" style={{ color: 'white' }} />
      {leftText && <Text style={{ color: 'white', fontWeight: '600' }}>{leftText}</Text>}
    </Button>
  );
  return (
    <View style={styles.absolute}>
      <Image
        style={{
          width: Dimensions.get('window').width,
          height: 210,
        }}
        resizeMode="cover"
        source={headerImage}
      />
      <LinearGradient
        colors={['#0E0805', 'transparent']}
        style={{ ...styles.absolute, ...styles.header }}
      >
        <Left>
          {left || leftBtn}
        </Left>
        <Right>
          {right || rightBtn}
        </Right>
      </LinearGradient>
    </View>
  );
};

const styles = {
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    alignItems: 'flex-start',
    height: 65,
    paddingTop: 10,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
  },
};
export default CustomHeader;
