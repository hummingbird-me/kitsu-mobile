import React from 'react';
import { View, Image, TouchableOpacity, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import * as colors from 'kitsu/constants/colors';
import fblogo from 'kitsu/assets/img/fblogo.png';
import { SidebarTitle, ItemSeparator } from './common/';
import { styles } from './styles';

class LinkedAccounts extends React.Component {
  static navigationOptions = {
    title: 'Linked Accounts',
  };

  onUnlinkAccount = () => {};

  renderItem = ({ item }) => (
    <View style={styles.item}>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 90, alignItems: 'center' }}>
            <Image
              source={fblogo}
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
      <View style={styles.containerStyle}>
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
    );
  }
}

const mapStateToProps = ({ user }) => ({});

LinkedAccounts.propTypes = {};

export default connect(mapStateToProps, {})(LinkedAccounts);
