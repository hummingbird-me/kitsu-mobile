import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { isNull } from 'lodash';
import { ViewMoreTextCache } from 'kitsu/utils/cache';
import { styles } from './styles';

interface ViewMoreTextProps {
  cacheKey?: string;
  textStyle?: object | unknown[];
  numberOfLines?: number;
  renderViewMore?(...args: unknown[]): unknown;
  renderViewLess?(...args: unknown[]): unknown;
}

export class ViewMoreText extends PureComponent<ViewMoreTextProps> {
  state = {
    showAllText: false,
    measured: false,
    fullHeight: null,
    shouldShowMore: false,
  }

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


  onLayout = (event) => {
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
  }

  handlePressViewMore = () => {
    this.setState({ showAllText: true });
  }

  handlePressViewLess = () => {
    this.setState({ showAllText: false });
  }

  renderViewMore = onPress => (
    <Text style={styles.button} onPress={onPress}>
      View more
    </Text>
  )

  renderViewLess = onPress => (
    <Text style={styles.button} onPress={onPress}>
      View less
    </Text>
  )

  renderFooter() {
    const { showAllText, shouldShowMore } = this.state;

    if (shouldShowMore && !showAllText) {
      const viewMore = (this.props.renderViewMore || this.renderViewMore);
      return viewMore(this.handlePressViewMore);
    } else if (shouldShowMore && showAllText) {
      const viewLess = (this.props.renderViewLess || this.renderViewLess);
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
          ref={(text) => { this.text = text; }}
          style={textStyle}
          {...props}
          onLayout={this.onLayout}
        >
          {children}
        </Text>
        {this.renderFooter()}
      </View>
    );
  }
}

ViewMoreText.defaultProps = {
  cacheKey: null,
  textStyle: null,
  numberOfLines: 0,
  renderViewMore: null,
  renderViewLess: null,
};
