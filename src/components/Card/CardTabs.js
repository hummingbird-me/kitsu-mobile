import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, Left, Right } from 'native-base';
import ScrollableTabView from 'react-native-scrollable-tab-view';

const renderTabBar = () => <SimpleTabBar />;

const renderFooter = (props) => {
  if (props.single) {
    return (
      <View style={{ ...styles.footer }}>
        <Button
          style={{ height: 30, justifyContent: 'center', flex: 1 }}
          transparent
          block
          onPress={() => props.onPress()}
        >
          <Text
            style={{ textAlign: 'center', color: '#333333', fontFamily: 'OpenSans', fontSize: 10 }}
          >
            {props.singleText}
          </Text>
        </Button>
      </View>
    );
  }
  return (
    <View style={styles.footer}>
      <Left>
        <Button style={{ height: 35 }} transparent block onPress={() => props.onLeftPress()}>
          <Text>{props.leftText}</Text>
        </Button>
      </Left>
      <View
        style={{
          width: 0,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: '#EEEEEE',
        }}
      />
      <Right>
        <Button style={{ height: 35 }} transparent block onPress={() => props.onRightPress()}>
          <Text>{props.rightText}</Text>
        </Button>
      </Right>
    </View>
  );
};
const CardTabs = props => (
  <View style={{ ...styles.container, ...props.style }}>
    <View>
      <ScrollableTabView renderTabBar={renderTabBar}>{props.children}</ScrollableTabView>
    </View>
    {renderFooter(props)}
  </View>
);

class SimpleTabBar extends React.PureComponent {
  tabIcons = [];

  setAnimationValue({ value }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = Math.min(1, Math.abs(value - i));
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  }

  // color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (204 - 59) * progress;
    const green = 89 + (204 - 89) * progress;
    const blue = 152 + (204 - 152) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
        }}
      >
        {this.props.tabs.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => this.props.goToPage(i)}
            style={{
              height: 27,
              padding: 5,
            }}
          >
            <Text
              style={{
                fontFamily: 'OpenSans',
                fontSize: 12,
                textAlign: 'left',
                color: this.props.activeTab === i ? '#333333' : '#B2B2B2',
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

SimpleTabBar.propTypes = {
  goToPage: PropTypes.func,
  activeTab: PropTypes.number,
  tabs: PropTypes.array,
};

CardTabs.propTypes = {
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  children: PropTypes.any,
  style: PropTypes.object,
};

CardTabs.defaultProps = {
  leftText: 'Cancel',
  rightText: 'Save',
  children: {},
  style: {},
};

const styles = {
  container: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginTop: 0,
    padding: 10,
    marginBottom: 5,
    backgroundColor: 'white',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    justifyContent: 'center',
    borderColor: '#EEEEEE',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    color: '#333333',
    fontFamily: 'OpenSans',
  },
  footerDivider: {
    width: 0,
    height: '60%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
  },
};

export default CardTabs;
