import React, { PureComponent } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as colors from 'kitsu/constants/colors';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { setDataSaver, setInitialPage } from 'kitsu/store/app/actions';
import { Navigation } from 'react-native-navigation';
import { SidebarHeader, SidebarTitle } from './common/';
import { styles } from './styles';


class AppSettings extends PureComponent {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
    dataSaver: PropTypes.bool,
    setDataSaver: PropTypes.func,
    setInitialPage: PropTypes.func,
    initialPage: PropTypes.string,
  };

  static defaultProps = {
    dataSaver: false,
    setDataSaver: null,
    setInitialPage: null,
    initialPage: '-',
  }

  onStartingPageChange = (option) => {
    if (this.props.setInitialPage) {
      this.props.setInitialPage(option);
    }
  }

  toggleDataSaver = () => {
    if (this.props.setDataSaver) {
      this.props.setDataSaver(!this.props.dataSaver);
    }
  }

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
              <Text style={styles.hintText}>
                Starting Page
              </Text>
              <Text style={styles.valueText}>
                {pageText}
              </Text>
            </View>
          </SelectMenu>
          <SidebarTitle title={'Feed'} />
          <TouchableOpacity style={styles.checkBoxContainer} onPress={this.toggleDataSaver}>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={styles.hintText}>
                Data Saver Mode
              </Text>
              <Text style={styles.valueText}>
                Tap to load images
              </Text>
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

export default connect(mapStateToProps, { setDataSaver, setInitialPage })(AppSettings);
