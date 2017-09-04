import React from 'react';
import { View, Text, TextInput, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { updateGeneralSettings } from 'kitsu/store/user/actions';
import { isEmpty } from 'lodash';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { SidebarTitle, ItemSeparator, SidebarButton } from './common/';
import { styles } from './styles';

class GeneralSettings extends React.Component {
  static navigationOptions = {
    title: 'General',
  };

  constructor(props) {
    super(props);
    this.filterOptions = [
      { text: 'Hide Adult Titles', value: 'on' },
      { text: 'Show Adult Titles O_O', value: 'off' },
      { text: 'Cancel', value: null },
    ];
    const { name, email, sfwFilter } = props.currentUser;
    this.state = {
      name,
      email,
      sfwFilter,
      password: '',
      confirmPassword: '',
      shouldShowValidationInput: false,
      selectMenuText: sfwFilter ? this.filterOptions[0].text : this.filterOptions[1].text,
    };
  }

  onSavePersonalSettings = () => {
    // TODO: HANDLE INPUT VALIDATION.
    const { name, email, password, confirmPassword, sfwFilter } = this.state;
    const { currentUser } = this.props;
    const valuesToUpdate = {
      ...((name !== currentUser.name && { name }) || {}),
      ...((email !== currentUser.email && { email }) || {}),
      ...((sfwFilter !== currentUser.sfwFilter && { sfwFilter }) || {}),
      ...((password === confirmPassword && { password }) || {}),
    };
    if (!isEmpty(valuesToUpdate)) {
      this.props.updateGeneralSettings(valuesToUpdate);
      this.setState({ password: '', confirmPassword: '', shouldShowValidationInput: false });
    }
  };

  onSelectFilterOption = (value, option) => {
    switch (value) {
      case 'on':
        this.setState({ sfwFilter: true, selectMenuText: option.text });
        break;
      case 'off':
        this.setState({ sfwFilter: false, selectMenuText: option.text });
        break;
      default:
        // cancel button pressed.
        break;
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
              <SidebarTitle title={'Personal Settings'} />
              <View style={styles.inputWrapper}>
                <Text style={styles.hintText}>
                  Username
                </Text>
                <TextInput
                  style={styles.input}
                  value={this.state.name}
                  onChangeText={t => this.setState({ name: t })}
                  autoCapitalize={'words'}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                  keyboardAppearance={'dark'}
                />
              </View>
              <ItemSeparator />
              <View style={styles.inputWrapper}>
                <Text style={styles.hintText}>
                  Email Address
                </Text>
                <TextInput
                  style={styles.input}
                  value={this.state.email}
                  onChangeText={t => this.setState({ email: t })}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                  keyboardAppearance={'dark'}
                />
              </View>
              <ItemSeparator />
              <View style={styles.inputWrapper}>
                <Text style={styles.hintText}>
                  Password
                </Text>
                <TextInput
                  style={styles.input}
                  value={this.state.password}
                  onChangeText={(t) => {
                    this.toggle(t);
                    this.setState({ password: t });
                  }}
                  secureTextEntry
                  placeholder={'Start typing to set a new password.'}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                  keyboardAppearance={'dark'}
                />
              </View>
              {this.state.shouldShowValidationInput &&
                <View style={styles.inputWrapper}>
                  <Text style={styles.hintText}>
                    Confirm Password
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={this.state.confirmPassword}
                    onChangeText={t => this.setState({ confirmPassword: t })}
                    secureTextEntry
                    placeholder={'Confirm password'}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    keyboardAppearance={'dark'}
                  />
                </View>}
              <SidebarTitle title={'Content on Kitsu'} />
              <SelectMenu
                style={styles.selectMenu}
                onOptionSelected={this.onSelectFilterOption}
                cancelButtonIndex={2}
                options={this.filterOptions}
              >
                <View>
                  <Text style={styles.hintText}>
                    R18+ titles in feed, libraries, or search?
                  </Text>
                  <Text style={styles.valueText}>
                    {this.state.selectMenuText}
                  </Text>
                </View>
              </SelectMenu>
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
