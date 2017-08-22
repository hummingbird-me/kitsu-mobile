import React, { Component } from 'react';
import { View, Image, TextInput, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { Text, Button, Container, Content, Spinner } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { updatePersonalSettings } from 'kitsu/store/user/actions';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';

import { SidebarHeader, SidebarTitle, ItemSeparator, SidebarDropdown } from './common/';

class GeneralSettings extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'General'} />,
    tabBarIcon: ({ tintColor }) => (
      <Image source={menu} style={{ tintColor, width: 20, height: 21 }} />
    ),
  });

  constructor(props) {
    super(props);

    this.sfwOptions = [{ title: 'Show Adult Titles (O_O)' }, { title: 'Hide Adult Titles' }];
    const { name, email, sfwFilter } = props.currentUser;
    this.state = {
      name,
      email,
      sfwFilter,
      password: '',
      shouldShowValidationInput: false,
    };
  }

  toggle = (nextText) => {
    LayoutAnimation.configureNext({
      duration: 120,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    if (nextText === '') {
      // this means user clears the input.
      this.setState({ shouldShowValidationInput: false });
    } else if (this.state.password.length > 6) {
      this.setState({ shouldShowValidationInput: true });
    }
  };

  render() {
    const { loading, updatePersonalSettings } = this.props;
    return (
      // TODO: handle marginTop: 77 for all other sidebar screens.
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
                  value={this.state.name}
                  onChangeText={t => this.setState({ name: t })}
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
                  onChangeText={t => this.setState({ email: t })}
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
                  onChangeText={(t) => {
                    this.toggle(t);
                    this.setState({ password: t });
                  }}
                  secureTextEntry
                  placeholder={'Start typing to set a new password.'}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                />
              </View>
              {this.state.shouldShowValidationInput &&
                <View
                  style={{ backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8 }}
                >
                  <Text style={{ fontSize: 10, color: 'grey', fontFamily: 'OpenSans' }}>
                    Current Password
                  </Text>
                  <TextInput
                    style={{ marginTop: 4, height: 30, fontFamily: 'OpenSans', fontSize: 14 }}
                    value={this.state.currentPassword}
                    onChangeText={t => this.setState({ currentPassword: t })}
                    secureTextEntry
                    placeholder={'Current Password'}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                  />
                </View>}
              <SidebarTitle style={{ marginTop: 20 }} title={'Content on Kitsu'} />
              <SidebarDropdown
                title={'R18+ titles in feed, libraries, or search?'}
                value={this.sfwOptions[Number(this.state.sfwFilter)].title}
                options={this.sfwOptions}
                onSelectOption={option =>
                  this.setState({ sfwFilter: option.title === this.sfwOptions[1].title })}
              />
              <View style={{ marginTop: 20, padding: 10, paddingLeft: 25, paddingRight: 25 }}>
                <Button
                  block
                  disabled={false && loading}
                  onPress={() => updatePersonalSettings()}
                  style={{
                    backgroundColor: colors.green,
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
  const { currentUser, loading } = user;
  return {
    currentUser,
    loading,
  };
};

GeneralSettings.propTypes = {};

export default connect(mapStateToProps, { updatePersonalSettings })(GeneralSettings);
