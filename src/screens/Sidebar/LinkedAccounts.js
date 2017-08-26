import React from 'react';
import { View, Image, TouchableOpacity, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { SidebarTitle, ItemSeparator } from './common/';

class LinkedAccounts extends React.Component {
  static navigationOptions = {
    title: 'Linked Accounts',
  };

  onUnlinkAccount = () => {};

  renderItem = ({ item }) => (
    <View style={styles.sectionListItem}>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 90, alignItems: 'center' }}>
            <Image
              source={{ uri: item.logoURL }}
              style={{ resizeMode: 'contain', width: 90, height: 40 }}
            />
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => this.onUnlinkAccount(item)}
          style={{
            backgroundColor: colors.darkGrey,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 8,
            borderRadius: 4,
          }}
        >
          <Text
            style={{ fontSize: 10, fontFamily: 'OpenSans', fontWeight: '600', color: colors.white }}
          >
            Disconnect
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    const { navigation } = this.props;
    return (
      // handle marginTop: 77
      (
        <Container style={styles.containerStyle}>
          <Content scrollEnabled={false}>
            <View style={{ flex: 1, marginTop: 77 }}>
              <SidebarTitle title={'Social Accounts'} />
              <FlatList
                data={[{ logoURL: 'https://www.famouslogos.us/images/facebook-logo.jpg' }]}
                keyExtractor={(item, index) => index}
                renderItem={this.renderItem}
                ItemSeparatorComponent={() => <ItemSeparator />}
                removeClippedSubviews={false}
                scrollEnabled={false}
              />
            </View>
          </Content>
        </Container>
      )
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
  sectionListItem: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
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

LinkedAccounts.propTypes = {};

export default connect(mapStateToProps, {})(LinkedAccounts);
