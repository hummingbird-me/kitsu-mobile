import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { scenePadding } from 'kitsu/screens/Feed/constants';

export const RowWrap = ({ alignItems, justifyContent, style, ...props }) => (
  <View
    style={[
      {
        flexDirection: 'row',
        alignItems,
        justifyContent,
      },
      style,
    ]}
    {...props}
  />
);

export const RowMain = ({ style, ...props }) => (
  <View
    style={[
      { flex: 1, paddingLeft: scenePadding },
      style,
    ]}
    {...props}
  />
);

RowWrap.propTypes = {
  alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),
  justifyContent: PropTypes.oneOf(['flex-start', 'center', 'space-between', 'space-around', 'flex-end']),
  style: PropTypes.object,
};

RowWrap.defaultProps = {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  style: {},
};

RowMain.propTypes = {
  style: PropTypes.object,
};

RowMain.defaultProps = {
  style: {},
};
