import React, { Component } from 'react';
import { View, Image, Text, TextInput, LayoutAnimation, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Button, Container, Content, Spinner } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { updateGeneralSettings } from 'kitsu/store/user/actions';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';
import { isEmpty } from 'lodash';
import {
  SidebarHeader,
  SidebarTitle,
  ItemSeparator,
  SidebarDropdown,
  SidebarButton,
} from './common/';

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

  onSavePersonalSettings = () => {
    // TODO: HANDLE INPUT VALIDATION.
    const { name, email, password, sfwFilter } = this.state;
    const { currentUser } = this.props;
    const valuesToUpdate = {
      ...((name !== currentUser.name && { name }) || {}),
      ...((email !== currentUser.email && { email }) || {}),
      ...((sfwFilter !== currentUser.sfwFilter && { sfwFilter }) || {}),
    };
    if (isEmpty(valuesToUpdate)) {
      this.props.updateGeneralSettings(valuesToUpdate);
    }
  };

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
      // only show after 8 chars
      this.setState({ shouldShowValidationInput: true });
    }
  };

  render() {
    const { loading } = this.props;
    return (
      // TODO: handle marginTop: 77 for all other sidebar screens.
      (
        <Container style={nativeBaseStyles.containerStyle}>
          <Content>
            <View style={{ flex: 1, marginTop: 77 }}>
              <SidebarTitle style={{ marginTop: 20 }} title={'Personal Settings'} />
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldText}>
                  Username
                </Text>
                <TextInput
                  style={styles.fieldInput}
                  value={this.state.name}
                  onChangeText={t => this.setState({ name: t })}
                  autoCapitalize={'words'}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                />
              </View>
              <ItemSeparator />
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldText}>
                  Email Address
                </Text>
                <TextInput
                  style={styles.fieldInput}
                  value={this.state.email}
                  onChangeText={t => this.setState({ email: t })}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                />
              </View>
              <ItemSeparator />
              <View style={styles.fieldWrapper}>
                <Text style={styles.fieldText}>
                  Password
                </Text>
                <TextInput
                  style={styles.fieldInput}
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
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldText}>
                    Current Password
                  </Text>
                  <TextInput
                    style={styles.fieldInput}
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
              <SidebarButton
                loading={loading}
                onPress={this.onSavePersonalSettings}
                title={'Save General Settings'}
              />
            </View>
          </Content>
        </Container>
      )
    );
  }
}

const nativeBaseStyles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
};

const styles = StyleSheet.create({
  fieldWrapper: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fieldText: {
    fontSize: 10,
    color: 'grey',
    fontFamily: 'OpenSans',
  },
  fieldInput: {
    marginTop: 4,
    height: 30,
    fontFamily: 'OpenSans',
    fontSize: 14,
  },
});

const mapStateToProps = ({ user }) => {
  const { currentUser, loading } = user;
  return {
    currentUser,
    loading,
  };
};

GeneralSettings.propTypes = {
  updateGeneralSettings: PropTypes.func,
  currentUser: PropTypes.object,
  loading: PropTypes.bool,
};

GeneralSettings.defaultProps = {
  updateGeneralSettings: () => {},
  currentUser: {},
  loading: true,
};

export default connect(mapStateToProps, { updateGeneralSettings })(GeneralSettings);
