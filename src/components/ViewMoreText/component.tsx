import { isNull } from 'lodash';
import React, { PureComponent } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Text,
  TextStyle,
  View,
} from 'react-native';

import { ViewMoreTextCache } from 'kitsu/utils/cache';

import { styles } from './styles';

export type ViewMoreTextProps = {
  cacheKey?: string;
  textStyle?: TextStyle;
  numberOfLines?: number;
  renderViewMore?(...args: unknown[]): unknown;
  renderViewLess?(...args: unknown[]): unknown;
  children: string;
};

export class ViewMoreText extends PureComponent<ViewMoreTextProps> {
  static defaultProps = {
    cacheKey: null,
    textStyle: null,
    numberOfLines: 0,
    renderViewMore: null,
    renderViewLess: null,
  };

  state = {
    showAllText: false,
    measured: false,
    fullHeight: null,
    shouldShowMore: false,
  };

  text?: Text | null;

  UNSAFE_componentWillMount() {
    const { cacheKey } = this.props;

    // Load height from cache if possible
    const cachedHeight = ViewMoreTextCache.get(cacheKey);
    if (cachedHeight) {
      this.setState({
        fullHeight: cachedHeight,
        measured: true,
      });
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const { fullHeight } = this.state;
    const { cacheKey } = this.props;

    const height = event.nativeEvent.layout.height;
    if (isNull(fullHeight)) {
      // Cache the height
      ViewMoreTextCache.set(cacheKey, height);
      this.setState({ fullHeight: height, measured: true });
      return;
    }

    if (fullHeight > height) {
      this.setState({ shouldShowMore: true });
    }
  };

  handlePressViewMore = () => {
    this.setState({ showAllText: true });
  };

  handlePressViewLess = () => {
    this.setState({ showAllText: false });
  };

  renderViewMore = (onPress: (e: GestureResponderEvent) => void) => (
    <Text style={styles.button} onPress={onPress}>
      View more
    </Text>
  );

  renderViewLess = (onPress: (e: GestureResponderEvent) => void) => (
    <Text style={styles.button} onPress={onPress}>
      View less
    </Text>
  );

  renderFooter() {
    const { showAllText, shouldShowMore } = this.state;

    if (shouldShowMore && !showAllText) {
      const viewMore = this.props.renderViewMore || this.renderViewMore;
      return viewMore(this.handlePressViewMore);
    } else if (shouldShowMore && showAllText) {
      const viewLess = this.props.renderViewLess || this.renderViewLess;
      return viewLess(this.handlePressViewLess);
    }
    return null;
  }

  render() {
    const { showAllText, measured } = this.state;
    const { textStyle, numberOfLines, children, ...props } = this.props;

    return (
      <View>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          ref={(text) => {
            this.text = text;
          }}
          style={textStyle}
          {...props}
          onLayout={this.onLayout}>
          {children}
        </Text>
        {this.renderFooter()}
      </View>
    );
  }
}
