import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import { commonStyles } from 'kitsu/common/styles';
import { kitsuConfig } from 'kitsu/config/env/';
import { SidebarHeader } from 'kitsu/screens/Sidebar/common';
import { WebComponent } from 'kitsu/utils/components';

import { styles } from './styles';

interface CannyBoardProps {
  componentId: any;
  token: string;
  type: string;
  title?: string;
}

export class CannyBoard extends React.Component<CannyBoardProps> {
  static defaultProps = {
    title: 'Canny',
  };

  state = {
    token: null,
    loading: true,
    keyboardHeight: 0,
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide
    );
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
  };

  keyboardDidHide = () => {
    this.setState({ keyboardHeight: 0 });
  };

  renderErrorComponent = () => (
    <View style={[commonStyles.centerCenter, { flex: 1 }]}>
      <Text style={styles.errorText}>Error loading the board.</Text>
    </View>
  );

  renderLoadingComponent = () => <ActivityIndicator />;

  render() {
    const { ssoToken, loading, keyboardHeight } = this.state;
    const { componentId, title, type } = this.props;
    const boardToken = kitsuConfig.cannyBoardTokens[type];
    const uri = `https://webview.canny.io?boardToken=${boardToken}&ssoToken=${ssoToken}`;
    const adjustProperty =
      Platform.OS === 'ios' ? 'paddingBottom' : 'marginBottom';

    return (
      <View style={styles.wrapper}>
        <SidebarHeader
          headerTitle={title}
          onBackPress={() => Navigation.pop(componentId)}
        />
        {loading ? (
          <View style={[commonStyles.centerCenter, { flex: 1 }]}>
            <ActivityIndicator />
          </View>
        ) : (
          <WebComponent
            style={[styles.webView, { [adjustProperty]: keyboardHeight }]}
            source={{
              uri,
            }}
            renderLoading={this.renderLoadingComponent}
            renderError={this.renderErrorComponent}
          />
        )}
      </View>
    );
  }
}
