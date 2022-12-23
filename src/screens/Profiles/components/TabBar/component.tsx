import React from 'react';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

interface TabBarProps {
  children?: React.ReactNode;
  style?: unknown;
  containerStyle?: unknown;
}

export const TabBar = props: TabBarProps => (
  <View style={[styles.container, props.style]} onLayout={props.onLayout}>
    <ScrollView
      ref={r => { props.onRef && props.onRef(r) }}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.tab, props.containerStyle]}
    >
      {props.children}
    </ScrollView>
  </View>
);

interface TabBarLinkProps {
  onPress?(...args: unknown[]): unknown;
  label?: string;
  isActive?: boolean;
}

export const TabBarLink = ({
  onPress,
  label,
  isActive
}: TabBarLinkProps) => (
  <TouchableOpacity onPress={onPress} style={styles.link}>
    <StyledText color={isActive ? 'dark' : 'grey'} size="xsmall" bold>{label}</StyledText>
  </TouchableOpacity>
);

TabBar.propTypes = {
  style: ViewPropTypes.style,
  containerStyle: ViewPropTypes.style
};

TabBar.defaultProps = {
  children: null,
  style: null,
  containerStyle: null,
};

TabBarLink.defaultProps = {
  onPress: null,
  label: '',
  isActive: false,
};
