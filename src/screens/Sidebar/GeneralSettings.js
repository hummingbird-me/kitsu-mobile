import React, { Component } from 'react';
import { View, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Text, Button, Container, Content, Spinner } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';

import { SidebarHeader, SidebarTitle, ItemSeparator, SidebarDropdown } from './common/';

class GeneralSettings extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'General'} />,
    tabBarIcon: ({ tintColor }) => (
      <Image source={menu} style={{ tintColor, width: 20, height: 21 }} />
    ),
  });

  state = {
    username: this.props.currentUser.name,
    email: this.props.currentUser.email,
    password: '',
    sfw: this.props.currentUser.sfwFilter,
  };

  sfwOptions = [{ title: 'Show Adult Titles (O_O)' }, { title: 'Hide Adult Titles' }];

  render() {
    const { navigation, currentUser } = this.props;
    const loading = false; // temporary.
    return (
      // handle marginTop: 77
      (
        <Container style={styles.containerStyle}>
          <Content>
            <View style={{ flex: 1, marginTop: 77 }}>
              <SidebarTitle style={{ marginTop: 20 }} title={'Personal Settings'} />
              <View style={{ backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ fontSize: 10, color: 'grey', fontFamily: 'OpenSans' }}>
                  Username
                </Text>
                <TextInput
                  style={{ marginTop: 4, height: 30, fontFamily: 'OpenSans', fontSize: 14 }}
                  value={this.state.username}
                  autoCapitalize={'words'}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                />
              </View>
              <ItemSeparator />
              <View style={{ backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ fontSize: 10, color: 'grey', fontFamily: 'OpenSans' }}>
                  Email Address
                </Text>
                <TextInput
                  style={{ marginTop: 4, height: 30, fontFamily: 'OpenSans', fontSize: 14 }}
                  value={this.state.email}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                />
              </View>
              <ItemSeparator />
              <View style={{ backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ fontSize: 10, color: 'grey', fontFamily: 'OpenSans' }}>
                  Password
                </Text>
                <TextInput
                  style={{ marginTop: 4, height: 30, fontFamily: 'OpenSans', fontSize: 14 }}
                  value={this.state.password}
                  secureTextEntry
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                />
              </View>
              <SidebarTitle style={{ marginTop: 20 }} title={'Content on Kitsu'} />
              <SidebarDropdown
                title={'R18+ titles in feed, libraries, or search?'}
                value={this.sfwOptions[Number(this.state.sfw)].title}
                options={this.sfwOptions}
                onSelectOption={sfw => this.setState({ sfw })}
              />
              <View style={{ marginTop: 20, padding: 10, paddingLeft: 25, paddingRight: 25 }}>
                <Button
                  block
                  disabled={false && loading}
                  onPress={() => {}}
                  style={{
                    backgroundColor: colors.lightGreen,
                    height: 47,
                    borderRadius: 3,
                  }}
                >
                  {loading
                    ? <Spinner size="small" color="rgba(255,255,255,0.4)" />
                    : <Text
                      style={{
                        color: colors.white,
                        fontFamily: 'OpenSans-Semibold',
                        lineHeight: 20,
                        fontSize: 14,
                      }}
                    >
                        Save General Settings
                      </Text>}
                </Button>
              </View>
            </View>
          </Content>
        </Container>
      )
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
};

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return {
    currentUser,
  };
};

GeneralSettings.propTypes = {};

export default connect(mapStateToProps, {})(GeneralSettings);
