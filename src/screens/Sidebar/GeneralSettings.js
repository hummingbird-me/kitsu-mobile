import React from 'react';
import { View, Text, TextInput, ScrollView, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { updateGeneralSettings } from 'kitsu/store/user/actions';
import isEmpty from 'lodash/isEmpty';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { navigationOptions, SidebarTitle, ItemSeparator, SidebarButton } from './common/';
import { styles } from './styles';

class GeneralSettings extends React.Component {
  static navigationOptions = ({ navigation }) => navigationOptions(navigation, 'General');

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
    } else {
      // only show after 8 chars
      this.setState({ shouldShowValidationInput: true });
    }
  };

  passwordState() {
    const { password, confirmPassword } = this.state;
    const passwordSet = !isEmpty(password) || !isEmpty(confirmPassword);
    const passwordsMatch = (password || '').trim() === (confirmPassword || '').trim();

    return {
      passwordSet,
      passwordsMatch,
    };
  }

  isModified() {
    const { currentUser } = this.props;
    const { name, email, sfwFilter } = this.state;

    if (!currentUser) return false;

    const isNameDifferent = name !== currentUser.name;
    const isEmailDifferent = email !== currentUser.email;
    const sfwDifferent = sfwFilter !== currentUser.sfwFilter;

    const { passwordSet, passwordsMatch } = this.passwordState();

    // If passwords have changed then we have modified if the passwords match
    if (passwordSet) return passwordsMatch;

    return isNameDifferent || isEmailDifferent || sfwDifferent;
  }

  render() {
    const { loading } = this.props;
    const modified = this.isModified();

    const { passwordSet, passwordsMatch } = this.passwordState();
    const buttonTitle = passwordSet && !passwordsMatch ? 'Password Do Not Match' : 'Save General Settings';

    return (
      <View style={styles.containerStyle}>
        <ScrollView scrollEnabled={false}>
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
            disabled={!modified}
            onPress={this.onSavePersonalSettings}
            title={buttonTitle}
          />
        </ScrollView>
      </View>
    );
  }
}

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
