import React, { PureComponent } from 'react';
import { View, Text, TextInput, ScrollView, LayoutAnimation, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import isEmpty from 'lodash/isEmpty';
import * as colors from 'kitsu/constants/colors';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { setDataSaver } from 'kitsu/store/app/actions';
import { navigationOptions, SidebarTitle, ItemSeparator, SidebarButton } from './common/';
import { styles } from './styles';


class AppSettings extends PureComponent {
  static navigationOptions = ({ navigation }) => navigationOptions(navigation, 'App');

  static propTypes = {
    dataSaver: PropTypes.bool,
    setDataSaver: PropTypes.func,
  };

  static defaultProps = {
    dataSaver: false,
    setDataSaver: null,
  }

  onStartingPageChange = (option) => {

  }

  toggleDataSaver = () => {
    if (this.props.setDataSaver) {
      this.props.setDataSaver(!this.props.dataSaver);
    }
  }

  render() {
    const { dataSaver } = this.props;

    const pages = ['Feed', 'Library', 'Nevermind'];
    return (
      <View style={styles.containerStyle}>
        <ScrollView scrollEnabled={false}>
          <SidebarTitle title={'General'} />
          {/* TODO: Flesh this out further */}
          <SelectMenu
            style={styles.selectMenu}
            onOptionSelected={this.onStartingPageChange}
            cancelButtonIndex={2}
            options={pages}
          >
            <View>
              <Text style={styles.hintText}>
                Starting Page
              </Text>
              <Text style={styles.valueText}>
                Feed
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
  const { dataSaver } = app;
  return { dataSaver };
};

export default connect(mapStateToProps, { setDataSaver })(AppSettings);
