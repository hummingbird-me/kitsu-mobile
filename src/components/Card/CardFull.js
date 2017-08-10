import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Left, Right } from 'native-base';
import PropTypes from 'prop-types';

const renderFooter = (props) => {
  if (props.single) {
    if (!props.singleText) {
      return null;
    }
    return (
      <View style={{ ...styles.footer }}>
        <Button
          style={{ height: 30, justifyContent: 'center', flex: 1 }}
          transparent
          block
          onPress={() => props.onPress()}
        >
          <Text
            style={{ textAlign: 'center', color: '#333333', fontFamily: 'OpenSans', fontSize: 10 }}
          >
            {props.singleText}
          </Text>
        </Button>
      </View>
    );
  }
  return (
    <View style={styles.footer}>
      <Left>
        <Button style={{ height: 35 }} transparent block onPress={() => props.onLeftPress()}>
          <Text>{props.leftText}</Text>
        </Button>
      </Left>
      <View style={styles.footerDivider} />
      <Right>
        <Button style={{ height: 35 }} transparent block onPress={() => props.onRightPress()}>
          <Text>{props.rightText}</Text>
        </Button>
      </Right>
    </View>
  );
};
const CardFull = props => (
  <View style={{ ...styles.container, ...props.style }}>
    <View style={{ paddingTop: 10, paddingLeft: 16, paddingBottom: 12, paddingRight: 16 }}>
      <View><Text style={styles.headerText}>{props.heading}</Text></View>
      <View style={{ paddingTop: 9 }}>
        {props.children}
      </View>
    </View>
    {renderFooter(props)}
  </View>
);

CardFull.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object,
  onPress: PropTypes.func,
  onRightPress: PropTypes.func,
  onLeftPress: PropTypes.func,
};

CardFull.defaultProps = {
  children: {},
  style: {},
  onPress: () => {},
  onRightPress: () => {},
  onLeftPress: () => {},
};

renderFooter.propTypes = {
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  onPress: PropTypes.func,
  onRightPress: PropTypes.func,
  onLeftPress: PropTypes.func,
};
renderFooter.defaultProps = {
  leftText: 'Cancel',
  rightText: 'Save',
  onPress: () => {},
  onRightPress: () => {},
  onLeftPress: () => {},
};

const styles = {
  container: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginTop: 0,
    marginBottom: 5,
    backgroundColor: 'white',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    justifyContent: 'center',
    borderColor: '#EEEEEE',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 12,
  },
  headerText: {
    fontSize: 12,
    color: '#333333',
    fontFamily: 'OpenSans',
    lineHeight: 17
  },
  footerDivider: {
    width: 0,
    height: '60%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
  },
};

export default CardFull;
