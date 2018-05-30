import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import { Button } from 'kitsu/components/Button/';
import { Input } from 'kitsu/components/Input';
import CustomIcon from 'kitsu/components/Icon';
import * as colors from 'kitsu/constants/colors';
import styles from './styles';

const RecoveryForm = ({ handleChange, data, onReset, loading, onCancel }) => (
  <View>
    <Input
      placeholder="E-mail"
      value={data.email}
      onChangeText={text => handleChange(text, 'email')}
      autoCapitalize="none"
    />
    <Button
      loading={loading}
      title={'Send password reset'}
      onPress={onReset}
      style={{ marginTop: 10 }}
    />
    <TouchableOpacity style={styles.forgotButton} onPress={onCancel}>
      <Text style={styles.forgotText}>Back to Sign In</Text>
    </TouchableOpacity>
  </View>
);

RecoveryForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onReset: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RecoveryForm;
