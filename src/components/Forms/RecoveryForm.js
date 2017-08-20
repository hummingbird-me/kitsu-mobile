import React from 'react';
import { View, Text } from 'react-native';
import { PropTypes } from 'prop-types';
import { Form, Input, Item, Button, Spinner } from 'native-base';
import CustomIcon from 'kitsu/components/Icon';
import * as colors from 'kitsu/constants/colors';

const RecoveryForm = ({ handleChange, data, onSubmit, loading }) => (
  <View>
    <Form style={{ padding: 20, paddingLeft: 10, paddingTop: 30 }}>
      <Item
        style={{
          borderBottomColor: 'rgba(255,255,255,0.2)',
          borderBottomWidth: 0.5,
        }}
      >
        <View style={{ width: 25 }}>
          <CustomIcon name="mail-icon" size={13} color="white" styles={{ opacity: 0.5 }} />
        </View>
        <Input
          placeholder="Email address"
          placeholderTextColor="rgba(255,255,254,0.5)"
          autoCapitalize="none"
          value={data.email}
          onChangeText={text => handleChange(text, 'email')}
          style={styles.inputStyle}
        />
      </Item>
    </Form>
    <View style={{ padding: 10, paddingLeft: 25 }}>
      <Button
        block
        disabled={loading}
        onPress={onSubmit}
        style={{
          backgroundColor: colors.green,
          height: 47,
          borderRadius: 3,
        }}
      >
        {loading
          ? <Spinner size="small" />
          : <Text
            style={{
              color: colors.white,
              fontFamily: 'OpenSans-Semibold',
              lineHeight: 20,
              fontSize: 15,
            }}
          >
              Send password reset
            </Text>}
      </Button>
    </View>
  </View>
);
const styles = {
  inputStyle: {
    fontSize: 15,
    height: 40.5,
    fontFamily: 'OpenSans',
    color: 'rgba(255,255,255,0.7)',
  },
};
RecoveryForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
export default RecoveryForm;
