import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { Button, Icon, Left, Right } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

const CustomHeader = ({
  navigation,
  headerImage,
  right,
  left,
  leftText,
  rightText,
  hasOverlay,
}) => {
  const rightBtn = (
    <Button
      style={{
        height: 20,
        width: 83,
        backgroundColor: '#16A085',
        justifyContent: 'center',
        marginRight: 10,
        borderRadius: 3,
        zIndex: 100,
      }}
      onPress={() => navigation.goBack()}
    >
      <Text style={{ color: 'white', fontSize: 10, fontFamily: "OpenSans", fontWeight: "600" }}>Follow</Text>
    </Button>
  );
  const leftBtn = (
    <Button transparent color="white" onPress={() => navigation.dismiss()}>
      <Icon name="arrow-back" style={{ color: 'white' }} />
      {leftText ? <Text style={{ color: 'white', fontWeight: '600' }}>{leftText}</Text> : <Text />}
    </Button>
  );
  const colors = [hasOverlay ? 'transparent' : '#0E0805', 'transparent'];
  return (
    <View style={styles.absolute}>
      <LinearGradient colors={colors} style={{ ...styles.absolute, ...styles.header }}>
        <Left>
          {left || leftBtn}
        </Left>
        <Right>
          {right || rightBtn}
        </Right>
      </LinearGradient>
      {hasOverlay &&
        <View style={[styles.absolute, { backgroundColor: 'rgba(0,0,0,0.36)', height: 210 }]} />}
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
    zIndex: 1,
  },
};
export default CustomHeader;
