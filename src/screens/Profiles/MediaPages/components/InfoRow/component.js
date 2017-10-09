import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { scenePadding } from 'kitsu/screens/Profiles/MediaPages/constants';
import { StyledText } from 'kitsu/screens/Profiles/MediaPages/parts';

const styles = StyleSheet.create({
  row: {
    padding: scenePadding,
    backgroundColor: '#FFFFFF',
  },
});

export const InfoRow = ({ label, content, contentComponent }) => (
  <View style={styles.row}>
    <StyledText size="xxsmall">{label}</StyledText>
    {content && <StyledText size="xsmall" bold style={{ marginTop: 5 }}>{content}</StyledText>}
    {contentComponent && <View style={{ marginHorizontal: -scenePadding }}>{contentComponent}</View>}
  </View>
);

InfoRow.propTypes = {
  label: PropTypes.string,
  content: PropTypes.string,
  contentComponent: PropTypes.element,
};

InfoRow.defaultProps = {
  label: null,
  content: null,
  contentComponent: null,
};