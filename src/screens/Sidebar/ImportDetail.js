import React from 'react';
import { View, Image, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Text, Container, Button } from 'native-base';
import * as colors from 'kitsu/constants/colors';
import menu from 'kitsu/assets/img/tabbar_icons/menu.png';
import PropTypes from 'prop-types';
import { SidebarHeader, ItemSeparator, SidebarButton } from './common/';

class ImportDetail extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => (
      <SidebarHeader navigation={navigation} headerTitle={navigation.state.params.item.title} />
    ),
    tabBarIcon: ({ tintColor }) => (
      <Image source={menu} style={{ tintColor, width: 20, height: 21 }} />
    ),
  });

  render() {
    const { navigation } = this.props;
    const item = navigation.state.params.item;
    return (
      // handle marginTop: 77
      (
        <Container style={styles.containerStyle}>
          <View style={{ marginTop: 77 }}>
            <View
              style={{ backgroundColor: colors.white, padding: 2, borderRadius: 4, margin: 12 }}
            >
              <View style={{ padding: 8 }}>
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={{ uri: item.logoURL }}
                    style={{ width: 120, height: 40, resizeMode: 'contain' }}
                  />
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    paddingHorizontal: 12,
                    fontFamily: 'OpenSans',
                    fontSize: 12,
                  }}
                >
                  Enter your username below to import your existing anime and manga progress.
                </Text>
              </View>
              <ItemSeparator />
              <View
                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
              >
                <TextInput
                  style={{ width: 300, height: 50, fontSize: 16, textAlign: 'center' }}
                  placeholder={`Your ${item.title} Username`}
                  underlineColorAndroid={'transparent'}
                  keyboardAppearance={'dark'}
                />
              </View>
            </View>
            <SidebarButton onPress={() => {}} title={'Save Privacy Settings'} loading={false} />
          </View>
        </Container>
      )
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
  sectionListItem: {
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 0,
    borderColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
    marginLeft: 0, // NATIVEBASE.
  },
};

const mapStateToProps = ({ user }) => ({});

ImportDetail.propTypes = {};

export default connect(mapStateToProps, {})(ImportDetail);
