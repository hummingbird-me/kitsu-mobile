import React, { PureComponent } from 'react';
import { ViewPropTypes, Platform, Dimensions, View } from 'react-native';
import { PropTypes } from 'prop-types';
import { TabBar } from 'kitsu/screens/Profiles/components/TabBar';

const WINDOW_WIDTH = Dimensions.get('window').width;

export class LibraryTabBar extends PureComponent {
  static propTypes = {
    goToPage: PropTypes.func,
    renderTab: PropTypes.func.isRequired,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    tabBarStyle: ViewPropTypes.style,
    tabBarContainerStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    goToPage: () => null,
    activeTab: null,
    tabs: [],
    tabBarStyle: {},
    tabBarContainerStyle: {},
  };

  state = {
    containerWidth: null,
  };

  _tabMeasurements = [];

  componentDidMount() {
    // Provided by react-native-scrollable-tab-view
    this.props.scrollValue.addListener(this.updateView);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.tabs) !== JSON.stringify(nextProps.tabs) && this.state.containerWidth) {
      this.setState({ containerWidth: null, });
    }
  }

  updateView = (offset) => {
    const position = Math.floor(offset.value);
    const pageOffset = offset.value % 1;
    const tabCount = this.props.tabs.length;
    const lastTabPosition = tabCount - 1;
    if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
      return;
    }
    if (this.necessaryMeasurementsCompleted(position, position === lastTabPosition)) {
      this.updateTabBar(position, pageOffset);
    }
  };

  necessaryMeasurementsCompleted = (position, isLastTab) => {
    return this._tabMeasurements[position] &&
      (isLastTab || this._tabMeasurements[position + 1]) &&
      this._tabContainerMeasurements &&
      this._containerMeasurements;
  };

  updateTabBar = (position, pageOffset) => {
    const containerWidth = this._containerMeasurements.width;
    const tabWidth = this._tabMeasurements[position].width;
    const nextTabMeasurements = this._tabMeasurements[position + 1];
    const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
    const tabOffset = this._tabMeasurements[position].left;
    const absolutePageOffset = pageOffset * tabWidth;
    let newScrollX = tabOffset + absolutePageOffset;

    newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
    newScrollX = newScrollX >= 0 ? newScrollX : 0;

    if (Platform.OS === 'android') {
      this._scrollView.scrollTo({ x: newScrollX, y: 0, animated: false, });
    } else {
      const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width);
      newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
      this._scrollView.scrollTo({ x: newScrollX, y: 0, animated: false, });
    }
  };

  measureTab = (page, event) => {
    const { x, width, height, } = event.nativeEvent.layout;
    this._tabMeasurements[page] = { left: x, right: x + width, width, height, };
    this.updateView({ value: this.props.scrollValue._value });
  };

  onTabContainerLayout = (e) => {
    this._tabContainerMeasurements = e.nativeEvent.layout;
    let width = this._tabContainerMeasurements.width;
    if (width < WINDOW_WIDTH) {
      width = WINDOW_WIDTH;
    }
    this.setState({ containerWidth: width });
    this.updateView({ value: this.props.scrollValue._value });
  };

  onContainerLayout = (e) => {
    this._containerMeasurements = e.nativeEvent.layout;
    this.updateView({ value: this.props.scrollValue._value });
  };

  render() {
    const {
      goToPage, // Provided by react-native-scrollable-tab-view
      renderTab,
      activeTab, // Provided by react-native-scrollable-tab-view
      tabs, // Provided by react-native-scrollable-tab-view
      tabBarStyle,
      tabBarContainerStyle,
    } = this.props;
    return (
      <TabBar
        style={tabBarStyle}
        containerStyle={tabBarContainerStyle}
        onLayout={this.onContainerLayout}
        onRef={r => { this._scrollView = r; }}
      >
        <View
          style={{ flexDirection: 'row', width: this.state.containerWidth }}
          onLayout={this.onTabContainerLayout}
        >
          {tabs.map((name, page) => {
            const isTabActive = activeTab === page;
            return renderTab(name, page, isTabActive, goToPage, (e) => this.measureTab(page, e));
          })}
        </View>
      </TabBar>
    );
  }
}
