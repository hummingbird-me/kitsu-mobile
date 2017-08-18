import React, { Component } from 'react';
import { View, Image, TextInput, StyleSheet, Platform, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Text, Button, Container, Content, Spinner, Switch, Icon, Left, Right, Item } from 'native-base';
import PropTypes from 'prop-types';
import SidebarHeader from './common/SidebarHeader';
import SidebarTitle from './common/SidebarTitle';
import SidebarDropdown from './common/SidebarDropdown';
import SidebarListItem, { ItemSeparator } from './common/SidebarListItem';
import * as colors from '../../constants/colors';

import menu from '../../assets/img/tabbar_icons/menu.png';
import library from '../../assets/img/sidebar_icons/library.png';
import privacy from '../../assets/img/sidebar_icons/privacy.png';
import linked from '../../assets/img/sidebar_icons/linked.png';
import blocking from '../../assets/img/sidebar_icons/blocking.png';
import settings from '../../assets/img/sidebar_icons/settings.png';

class Library extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: () => <SidebarHeader navigation={navigation} headerTitle={'Library'} />,
    tabBarIcon: (
      { tintColor },
    ) => (
        <Image
          source={menu}
          style={{ tintColor, width: 20, height: 21 }}
        />
      ),
  });

  state = {
    titleDisplay: 'Option 1 is a long text',
    ratingVal: 'Option 3',
  }

  render() {
    const { navigation } = this.props;
    const loading = false; // temporary.
    return ( // handle marginTop: 77
      <Container style={styles.containerStyle}>
        <View style={{ marginTop: 77 }}>
          <SidebarTitle style={{ marginTop: 20 }} title={'Media Preferences'} />
          <SidebarDropdown
            title={'Title Display'}
            value={this.state.titleDisplay}
            options={[
              { title: 'Option 1 has a long text' },
              { title: 'Option 2 also has a long text' },
              { title: 'Option 3' },
            ]}
            onSelectOption={(titleDisplay) => this.setState({ titleDisplay })}
          />
          <ItemSeparator />
          <SidebarDropdown
            title={'Rating Value'}
            value={this.state.ratingVal}
            options={[
              { title: 'Option 1 has a long text' },
              { title: 'Option 2' },
              { title: 'Option 3 times 3 is Option 9 and we don\'t have it. Let\'s just say option 3 has the longest text we could imagine' },
            ]}
            onSelectOption={(ratingVal) => this.setState({ ratingVal })}
          />
          <SidebarTitle style={{ marginTop: 20 }} title={'Account Settings'} />
          <FlatList
            data={[
              { title: 'Import Library', image: library, target: 'ImportLibrary' },
              { title: 'Export Library', image: library, target: '' },
            ]}
            keyExtractor={item => item.title}
            renderItem={({ item }) => <SidebarListItem title={item.title} image={item.image} onPress={() => navigation.navigate(item.target)} />}
            ItemSeparatorComponent={() => <ItemSeparator />}
            removeClippedSubviews={false}
            scrollEnabled={false}
          />
          <View style={{ marginTop: 20, padding: 10, paddingLeft: 25, paddingRight: 25 }}>
            <Button
              block
              disabled={false && loading}
              onPress={() => { }}
              style={{
                backgroundColor: colors.lightGreen,
                height: 47,
                borderRadius: 3,
              }}
            >
              {loading
                ? <Spinner size="small" color="rgba(255,255,255,0.4)" />
                : <Text
                  style={{
                    color: colors.white,
                    fontFamily: 'OpenSans-Semibold',
                    lineHeight: 20,
                    fontSize: 14,
                  }}
                >
                  Save Library Settings
                  </Text>}
            </Button>
          </View>
        </View>
      </Container>
    );
  }
}

const styles = {
  containerStyle: { backgroundColor: colors.listBackPurple },
};

const mapStateToProps = ({ user }) => {
  return {
  };
};

Library.propTypes = {
};

export default connect(mapStateToProps, {})(Library);
