import React from 'react';
import { View, TextInput, Text, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import * as colors from 'kitsu/constants/colors';
import { Kitsu, setToken } from 'kitsu/config/api';
import { Button } from 'kitsu/components/Button';
import { ItemSeparator } from 'kitsu/screens/Sidebar/common/';
import { completeOnboarding } from 'kitsu/store/onboarding/actions';
import { styles } from './styles';
import { styles as commonStyles } from '../common/styles';

class ImportDetail extends React.Component {
  static navigationOptions = {
    backEnabled: true,
  };

  state = {
    showModal: false,
    errMessage: null,
    loading: false,
    username: '',
  };

  onImportButtonPressed = async () => {
    const { accessToken, currentUser, navigation } = this.props;
    const item = navigation.state.params.item;
    setToken(accessToken);
    const kind = item.title === 'MyAnimeList' ? 'my-anime-list' : 'anilist';
    this.setState({ loading: true, errMessage: null });
    try {
      const res = await Kitsu.create('listImports', {
        user: { id: currentUser.id },
        inputText: this.state.username,
        strategy: 'greater',
        kind,
      });
      this.setState({
        showModal: true,
        loading: false,
        errMessage: res.errorMessage,
      });
    } catch (e) {
      // TODO: we may have crashes here.
      console.log('failed import', e);
      this.setState({
        showModal: true,
        errMessage: e && e[0].title,
        loading: false,
      });
    }
  };

  onFinish = () => {
    this.setState(
      {
        showModal: false,
      },
      !this.state.errMessage // determines modal button behavior
        ? () => {
          this.props.completeOnboarding(this.props.navigation);
        }
        : null,
    );
  };

  onCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { loading, username, errMessage, showModal } = this.state;
    const item = this.props.navigation.state.params.item;
    return (
      <View style={commonStyles.container}>
        <View style={styles.card}>
          <View style={{ padding: 8 }}>
            <View style={{ alignItems: 'center' }}>
              <FastImage source={item.image} style={styles.cardLogo} />
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
        <Modal
          animationType={'fade'}
          visible={showModal}
          transparent
          onRequestClose={this.onCloseModal}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              alignItems: 'center',
            }}
          >
            <View style={[styles.card, { marginTop: 100, padding: 8 }]}>
              {!errMessage ? (
                <View>
                  <Text style={styles.importModalTitle}>
                    Hang tight! We{"'"}re importing your data!
                  </Text>
                  <Text style={styles.importModalText}>
                    Your {item.title} import will continue in the background. We{"'"}ll send you a
                    notification when your import has completed!
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.importModalTitle}>Bummer!</Text>
                  <Text
                    style={[
                      styles.importModalText,
                      {
                        marginBottom: 4,
                        minWidth: 240,
                      },
                    ]}
                  >
                    {errMessage}
                  </Text>
                </View>
              )}
              <Button onPress={this.onFinish} title={'Done'} loading={loading} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  currentUser: user.currentUser,
  accessToken: auth.tokens.access_token,
});

export default connect(mapStateToProps, { completeOnboarding })(ImportDetail);
