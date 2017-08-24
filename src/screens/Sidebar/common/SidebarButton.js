import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Spinner } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';

const SidebarButton = ({ loading, onPress, title, style }) => (
  <View style={[styles.wrapper, style]}>
    <Button block disabled={false && loading} onPress={onPress} style={nativeBaseStyles.button}>
      {loading
        ? <Spinner size="small" color="rgba(255,255,255,0.4)" />
        : <Text style={styles.title}>
          {title}
        </Text>}
    </Button>
  </View>
);

const nativeBaseStyles = {
  button: {
    backgroundColor: colors.green,
    height: 47,
    borderRadius: 3,
  },
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
  },
  title: {
    color: colors.white,
    fontFamily: 'OpenSans-Semibold',
    lineHeight: 20,
    fontSize: 14,
  },
});

SidebarButton.propTypes = {
  loading: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

SidebarButton.defaultProps = {
  loading: false,
  onPress: () => {},
  title: 'Save',
};

export default SidebarButton;
