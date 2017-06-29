import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, Left, Right, Thumbnail } from 'native-base';
import PropTypes from 'prop-types';

import Card from './Card';

const CardStatus = (props) => {
  const size = props.thumbSize || 34;
  return (
    <Card {...props}>
      <View style={{ flexDirection: 'row', paddingRight: 5, paddingLeft: 5 }}>
        <Thumbnail
          style={{ width: size, height: size, borderRadius: size / 2 }}
          source={require('../../assets/img/posters/fullmetal.jpg')}
        />
        <TextInput
          style={{ flex: 1, padding: 10, fontSize: 14, fontFamily: 'OpenSans' }}
          multiline
          placeholderTextColor="#B5B5B5"
          placeholder="Write something to Rob…"
        />
      </View>
    </Card>
  );
};

CardStatus.propTypes = {
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  children: PropTypes.any,
  style: PropTypes.object,
};

CardStatus.defaultProps = {
  leftText: 'Cancel',
  rightText: 'Save',
  children: {},
  style: {},
};

export default CardStatus;
