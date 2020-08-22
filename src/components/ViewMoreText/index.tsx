import React, { PureComponent } from 'react';
import { Text, View, TextStyle, LayoutChangeEvent } from 'react-native';
import { isNull } from 'lodash';
import { ViewMoreTextCache } from 'app/utils/cache';
import { styles } from './styles';

export class ViewMoreText extends PureComponent<{
  cacheKey?: string;
  style?: TextStyle;
  numberOfLines?: number;
  renderViewMore?: any;
  renderViewLess?: any;
}> {
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

  componentWillMount() {
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

  renderViewMore = (onPress: any) => (
    <Text style={styles.button} onPress={onPress}>
      View more
    </Text>
  );

  renderViewLess = (onPress: any) => (
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
    const { style, numberOfLines, children, ...props } = this.props;

    return (
      <View>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          style={style}
          {...props}
          onLayout={this.onLayout}>
          {children}
        </Text>
        {this.renderFooter()}
      </View>
    );
  }
}
