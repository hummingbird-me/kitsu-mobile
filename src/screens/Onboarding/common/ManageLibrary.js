import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { connect } from 'react-redux';
import { styles } from './styles';
import { styles as commonStyles } from '../common/styles';

const ManageLibrary = ({ navigation, accounts }) => (
  <View style={commonStyles.container}>
    <View style={styles.contentWrapper}>
      <Text style={[commonStyles.tutorialText, styles.tutorialText]}>
        Welcome to Kitsu, the new home of the Aozora community. Let{"'"}s break the ice!
      </Text>
      <Button
        onPress={() => {
          if (accounts.kitsu) {
            // if there is kitsu, we have conflict.
            navigation.navigate('SelectAccountScreen');
          } else {
            navigation.navigate('CreateAccountScreen');
          }
        }}
        title={"Let's get started!"}
        titleStyle={commonStyles.buttonTitleStyle}
      />
    </View>
  </View>
);

const mapStateToProps = ({ user }) => {
  const { loading, error, conflicts: accounts } = user;
  return { loading, error, accounts };
};
export default connect(mapStateToProps, null)(ManageLibrary);
