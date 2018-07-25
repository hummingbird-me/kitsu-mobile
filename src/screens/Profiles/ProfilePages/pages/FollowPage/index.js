import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { FollowList } from 'kitsu/screens/Profiles/components/FollowList';
import { ScrollableTabBar } from 'kitsu/components/ScrollableTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { listBackPurple } from 'kitsu/constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const renderScrollTabBar = () => <ScrollableTabBar />;
const TAB_LISTS = ['Following', 'Followers'];

class FollowPage extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => ({
    header: <CustomHeader
      backgroundColor={listBackPurple}
      leftButtonAction={() => navigation.goBack()}
      leftButtonTitle="Back"
    />,
  });

  componentWillMount() {
    this.activeTab = this.props.navigation.getParam('label', undefined);
  }

  goToInitialTab() {
    this.scrollableTabView.goToPage(TAB_LISTS.indexOf(this.activeTab), 100);
  }

  renderSearchBox() {
    return (
      <TouchableOpacity style={styles.searchBox} onPress={this.navigateToSearch}>
        <Icon
          name="search"
          style={styles.searchIcon}
        />
        <StyledText color="dark" textStyle={styles.searchText}>Search Library</StyledText>
      </TouchableOpacity>
    );
  }

  render() {
    const followingCount = this.props.navigation.getParam('followingCount', undefined);
    const followersCount = this.props.navigation.getParam('followersCount', undefined);
    const label = this.props.navigation.getParam('label', undefined);
    const currentUser = this.props.navigation.getParam('currentUser', undefined);

    return (
      <View style={styles.container}>
        <ScrollableTabView
          locked
          style={{ width: SCREEN_WIDTH }}
          initialPage={TAB_LISTS.indexOf(label)}
          ref={(ref) => { this.scrollableTabView = ref; }}
          renderTabBar={renderScrollTabBar}
          onChangeTab={({ i }) => { this.activeTab = TAB_LISTS[i]; }}
        >
          <View
            key="Following"
            tabLabel={`Following${followingCount === undefined ? '' : ` · ${followingCount}`}`}
            id="following"
          >
            {this.renderSearchBox()}
            <FollowList
              navigation={this.props.navigation}
              currentUser={currentUser}
              listType="Following"
              goToInitialTab={() => { this.goToInitialTab(); }}
            />
          </View>
          <View
            key="Followers"
            tabLabel={`Followers${followersCount === undefined ? '' : ` · ${followersCount}`}`}
            id="followers"
          >
            {this.renderSearchBox()}
            <FollowList
              navigation={this.props.navigation}
              currentUser={currentUser}
              listType="Followers"
              goToInitialTab={() => { this.goToInitialTab(); }}
            />
          </View>
        </ScrollableTabView>
      </View>
    );
  }
}

export default FollowPage;
