import React from 'react';
import { View, Image, TextInput, Text, Modal } from 'react-native';
import { connect } from 'react-redux';
import * as colors from 'kitsu/constants/colors';
import PropTypes from 'prop-types';
import { Kitsu, setToken } from 'kitsu/config/api';
import { ItemSeparator, SidebarButton } from './common/';
import styles from './styles';

class ImportDetail extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.item.title,
  });

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
      console.log('failed import', e);
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
          <View
            style={{
              backgroundColor: colors.white,
              padding: 2,
              borderRadius: 4,
              marginHorizontal: 12,
              marginVertical: 20,
            }}
          >
            <View style={{ padding: 8 }}>
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={{ uri: item.logoURL }}
                  style={{ width: 120, height: 40, resizeMode: 'contain' }}
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  paddingHorizontal: 12,
                  fontFamily: 'OpenSans',
                  fontSize: 12,
                }}
              >
                Enter your username below to import your existing anime and manga progress.
              </Text>
            </View>
            <ItemSeparator />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                style={{ width: 300, height: 50, fontSize: 16, textAlign: 'center' }}
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
            style={{ marginTop: 0 }}
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
            <View
              style={{
                top: 80,
                backgroundColor: colors.white,
                borderRadius: 4,
                margin: 12,
                paddingTop: 8,
                paddingHorizontal: 4,
              }}
            >
              {!errMessage
                ? <View>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      paddingVertical: 8,
                      fontSize: 14,
                    }}
                  >
                      Hang tight! We're importing your data!
                    </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      paddingHorizontal: 12,
                      fontFamily: 'OpenSans',
                      fontSize: 12,
                    }}
                  >
                      Your {item.title}
                      import will continue in the background. We'll send you a notification when your import has completed!
                    </Text>
                </View>
                : <View>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      paddingVertical: 8,
                      fontSize: 14,
                    }}
                  >
                      Bummer!
                    </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      paddingHorizontal: 12,
                      marginBottom: 4,
                      fontFamily: 'OpenSans',
                      fontSize: 12,
                      minWidth: 240,
                    }}
                  >
                    {errMessage}
                  </Text>
                </View>}
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
