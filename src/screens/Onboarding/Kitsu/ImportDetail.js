import React from 'react';
import { View, Image, TextInput, Text } from 'react-native';
import { connect } from 'react-redux';
import * as colors from 'kitsu/constants/colors';
import { Kitsu, setToken } from 'kitsu/config/api';
import { Button } from 'kitsu/components/Button';
import { ItemSeparator } from 'kitsu/screens/Sidebar/common/';
import { styles } from './styles';
import { styles as commonStyles } from '../common/styles';

class ImportDetail extends React.Component {
  static navigationOptions = {
    backEnabled: true,
  };

  state = {
    errMessage: null,
    loading: false,
    username: '',
  };

  onImportButtonPressed = async () => {
    const { accessToken, currentUser, navigation } = this.props;
    const item = navigation.state.params.item;
    setToken(accessToken);
    const kind = item.title === 'MyAnimeList' ? 'my-anime-list' : 'anilist';
    this.setState({ loading: true });
    try {
      const res = await Kitsu.create('listImports', {
        user: { id: currentUser.id },
        inputText: this.state.username,
        strategy: 'greater',
        kind,
      });
      this.setState({
        loading: false,
        errMessage: res.errorMessage,
      });
    } catch (e) {
      // TODO: we may have crashes here.
      // console.log('failed import', e);
      this.setState({
        errMessage: e && e[0].title,
        loading: false,
      });
    }
  };

  onFinish = (navigation) => {
    // TODO: fetch import list when went back.
  };

  render() {
    const { loading, username } = this.state;
    const item = this.props.navigation.state.params.item;
    return (
      <View style={commonStyles.container}>
        <View style={styles.card}>
          <View style={{ padding: 8 }}>
            <View style={{ alignItems: 'center' }}>
              <Image source={item.image} style={styles.cardLogo} />
            </View>
            <Text style={styles.cardText}>
              Enter your username below to import your existing anime and manga progress.
            </Text>
          </View>
          <ItemSeparator />
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={t => this.setState({ username: t })}
              placeholder={`Your ${item.title} Username`}
              placeholderTextColor={colors.grey}
              underlineColorAndroid={'transparent'}
              autoCapitalize={'none'}
              keyboardAppearance={'dark'}
            />
          </View>
        </View>
        <Button
          style={{ marginTop: 0, paddingHorizontal: 12 }}
          disabled={username.length === 0}
          onPress={this.onImportButtonPressed}
          title={`Start ${item.title} Import`}
          loading={loading}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  currentUser: user.currentUser,
  accessToken: auth.tokens.access_token,
});

export default connect(mapStateToProps, {})(ImportDetail);
