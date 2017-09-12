import React from 'react';
import { View, TextInput } from 'react-native';
import { Thumbnail } from 'native-base';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';

import { defaultAvatar } from 'kitsu/constants/app';

import Card from './Card';

const CardStatus = (props) => {
  const size = props.thumbSize || 34;
  const image = props.user.avatar ? props.user.avatar.medium : defaultAvatar;
  return (
    <Card {...props}>
      <View style={{ flexDirection: 'row', paddingRight: 5, paddingLeft: 5 }}>
        <Thumbnail
          style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#d3d3d3' }}
          source={{ uri: image }}
        />
        <TextInput
          style={{ flex: 1, padding: 10, fontSize: 14, fontFamily: 'OpenSans' }}
          multiline
          placeholderTextColor="#B5B5B5"
          placeholder={`Write something to ${capitalize(props.toUser.name)}…`}
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
