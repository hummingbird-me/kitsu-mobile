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
      <Left>
        <Button style={ styles.postButton } transparent block>
          <Text style={ styles.postButtonText }>{props.leftText}</Text>
        </Button>
      </Left>
      <View style={styles.footerDivider} />
      <Right>
        <Button style={ styles.postButton } transparent rounded block>
          <Text style={ styles.postButtonText }>{props.rightText}</Text>
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
    borderRadius: 3,
    backgroundColor: 'white',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 3,
    alignItems: 'center',
    backgroundColor: '#FDFDFD',
  },
  footerDivider: {
    width: 0,
    height: '60%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
  },
  postButtonText: {
    fontFamily: "OpenSans",
    fontSize: 12,
    color: "#646464",
    fontWeight: '600',
  },
  postButton: {
    height: 35,
    borderRadius: 15,
  },
};

export default Card;
