import React from 'react';
import { View, Text, ActivityIndicator, Keyboard, Platform } from 'react-native';
import { connect } from 'react-redux';
import { kitsuConfig } from 'app/config/env/';
import { commonStyles } from 'app/common/styles';
import { SidebarHeader } from 'app/screens/Sidebar/common';
import { WebComponent } from 'app/utils/components';
import { Navigation } from 'react-native-navigation';
import { PropTypes } from 'prop-types';
import { styles } from './styles';

export class CannyBoard extends React.Component {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
    token: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string,
  };

  static defaultProps = {
    title: 'Canny',
  }

  state = {
    token: null,
    loading: true,
    keyboardHeight: 0,
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    this.getCannySsoToken();
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
  }

  getCannySsoToken = async () => {
    const { token } = this.props;
    try {
      const response = await fetch('https://kitsu.io/api/edge/sso/canny', {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      if (json && json.token) {
        this.setState({
          ssoToken: json.token,
          loading: false,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  keyboardDidShow = ({ endCoordinates: { height } }) => {
    this.setState({ keyboardHeight: height });
  }

  keyboardDidHide = () => {
    this.setState({ keyboardHeight: 0 });
  }


  renderErrorComponent = () => (
    <View style={[commonStyles.centerCenter, { flex: 1 }]}>
      <Text style={styles.errorText}>Error loading the board.</Text>
    </View>
  )

  renderLoadingComponent = () => (
    <ActivityIndicator />
  )

  render() {
    const { ssoToken, loading, keyboardHeight } = this.state;
    const { componentId, title, type } = this.props;
    const boardToken = kitsuConfig.cannyBoardTokens[type];
    const uri = `https://webview.canny.io?boardToken=${boardToken}&ssoToken=${ssoToken}`;
    const adjustProperty = Platform.OS === 'ios' ? 'paddingBottom' : 'marginBottom';

    return (
      <View style={styles.wrapper}>
        <SidebarHeader
          headerTitle={title}
          onBackPress={() => Navigation.pop(componentId)}
        />
        {loading
          ? <View style={[commonStyles.centerCenter, { flex: 1 }]}>
            <ActivityIndicator />
          </View>
          : <WebComponent
            style={[styles.webView, { [adjustProperty]: keyboardHeight }]}
            source={{
              uri,
            }}
            renderLoading={this.renderLoadingComponent}
            renderError={this.renderErrorComponent}
          />
        }
      </View>
    );
  }
}
