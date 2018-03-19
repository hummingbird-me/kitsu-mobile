import React from 'react';
import { View, TextInput, Text, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import * as colors from 'kitsu/constants/colors';
import PropTypes from 'prop-types';
import { Kitsu, setToken } from 'kitsu/config/api';
import { navigationOptions, ItemSeparator, SidebarButton } from 'kitsu/screens/Sidebar/common/';
import { styles } from './styles';

class ImportDetail extends React.Component {
  static navigationOptions = ({ navigation }) => (
    navigationOptions(navigation, navigation.state.params.item.title)
  );

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
    this.setState({ loading: true });
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
      // console.log('failed import', e);
      this.setState({
        showModal: true,
        errMessage: e && e[0].title,
        loading: false,
      });
    }
  };

  onFinish = (navigation) => {
    // TODO: fetch import list when went back.
    this.setState(
      {
        showModal: false,
      },
      !this.state.errMessage ? navigation.goBack : null,
    );
  };

  render() {
    const { navigation } = this.props;
    const { loading, username, errMessage } = this.state;
    const item = navigation.state.params.item;
    return (
      <View style={styles.containerStyle}>
        <View>
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
                underlineColorAndroid={'transparent'}
                autoCapitalize={'none'}
                keyboardAppearance={'dark'}
              />
            </View>
          </View>
          <SidebarButton
            style={{ marginTop: 0, paddingHorizontal: 12 }}
            disabled={username.length === 0}
            onPress={this.onImportButtonPressed}
            title={`Start ${item.title} Import`}
            loading={loading}
          />
        </View>
        <Modal animationType={'fade'} visible={this.state.showModal} transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              alignItems: 'center',
            }}
          >
            <View style={[styles.card, { marginTop: 100 }]}>
              {!errMessage ? (
                <View>
                  <Text style={styles.modalTitle}>Hang tight! We{"'"}re importing your data!</Text>
                  <Text style={styles.modalText}>
                    Your {item.title} import will continue in the background. We{"'"}ll send you a
                    notification when your import has completed!
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.modalTitle}>Bummer!</Text>
                  <Text
                    style={[
                      styles.modalText,
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
              <SidebarButton
                style={{ marginTop: 0 }}
                onPress={() => this.onFinish(navigation)}
                title={'Finish'}
                loading={loading}
              />
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

ImportDetail.propTypes = {};

export default connect(mapStateToProps, {})(ImportDetail);
