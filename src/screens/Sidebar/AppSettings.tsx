import React, { PureComponent } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import { SelectMenu } from 'kitsu/components/SelectMenu';
import * as colors from 'kitsu/constants/colors';
import { setDataSaver, setInitialPage } from 'kitsu/store/app/actions';

import { SidebarHeader, SidebarTitle } from './common/';
import { styles } from './styles';

interface AppSettingsProps {
  componentId: any;
  dataSaver?: boolean;
  setDataSaver?(...args: unknown[]): unknown;
  setInitialPage?(...args: unknown[]): unknown;
  initialPage?: string;
}

class AppSettings extends PureComponent<AppSettingsProps> {
  static defaultProps = {
    dataSaver: false,
    setDataSaver: null,
    setInitialPage: null,
    initialPage: '-',
  };

  onStartingPageChange = (option) => {
    if (this.props.setInitialPage) {
      this.props.setInitialPage(option);
    }
  };

  toggleDataSaver = () => {
    if (this.props.setDataSaver) {
      this.props.setDataSaver(!this.props.dataSaver);
    }
  };

  render() {
    const { dataSaver, initialPage, componentId } = this.props;

    // The pages
    const pages = [
      'Feed',
      'Search',
      { text: 'Quick Update', value: 'QuickUpdate' },
      'Library',
      'Nevermind',
    ];

    // Page title display
    let pageText = initialPage;
    if (initialPage === 'QuickUpdate') {
      pageText = 'Quick Update';
    }

    return (
      <View style={styles.containerStyle}>
        <SidebarHeader
          headerTitle={'App'}
          onBackPress={() => Navigation.pop(componentId)}
        />
        <ScrollView style={{ flex: 1 }}>
          <SidebarTitle title={'General'} />
          <SelectMenu
            style={styles.selectMenu}
            onOptionSelected={this.onStartingPageChange}
            options={pages}
          >
            <View>
              <Text style={styles.hintText}>Starting Page</Text>
              <Text style={styles.valueText}>{pageText}</Text>
            </View>
          </SelectMenu>
          <SidebarTitle title={'Feed'} />
          <TouchableOpacity
            style={styles.checkBoxContainer}
            onPress={this.toggleDataSaver}
          >
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={styles.hintText}>Data Saver Mode</Text>
              <Text style={styles.valueText}>Tap to load images</Text>
            </View>
            <Icon
              name={dataSaver ? 'check-circle' : 'circle-thin'}
              color={dataSaver ? colors.green : colors.lightGrey}
              size={24}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ app }) => {
  const { dataSaver, initialPage } = app;
  return { dataSaver, initialPage };
};

export default connect(mapStateToProps, { setDataSaver, setInitialPage })(
  AppSettings
);
