import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Left, Right } from 'native-base';
import PropTypes from 'prop-types';

const Card = props => (
  <View style={{ ...styles.container, ...props.style }}>
    <View style={{ padding: 10 }}>
      {props.children}
    </View>
    <View style={styles.footer}>
      <Left style={{ height: 35, borderRadius: 15 }}>
        <Button style={{ height: 35, borderRadius: 15 }} transparent block>
          <Text style={{ fontFamily: "OpenSans", fontSize: 12, color: "#646464"}}>{props.leftText}</Text>
        </Button>
      </Left>
      <View style={styles.footerDivider} />
      <Right style={{ height: 35, borderRadius: 15 }}>
        <Button style={{ height: 35, borderRadius: 15 }} transparent rounded block>
          <Text style={{ fontFamily: "OpenSans", fontSize: 12, color: "#646464"}}>{props.rightText}</Text>
        </Button>
      </Right>
    </View>
  </View>
);

Card.propTypes = {
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  children: PropTypes.any,
  style: PropTypes.object,
};

Card.defaultProps = {
  leftText: 'Cancel',
  rightText: 'Save',
  children: {},
  style: {},
};

const styles = {
  container: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginTop: 0,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#FDFDFD',
  },
  footerDivider: {
    width: 0,
    height: '60%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
  },
};

export default Card;
