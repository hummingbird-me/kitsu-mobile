import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import { PropTypes } from 'prop-types';
import { styles } from './styles';

export class ViewMoreText extends PureComponent {
  state = {
    showAllText: false,
  }

  async componentDidMount() {
    await nextFrameAsync();

    // Get the height of the text with no restriction on number of lines
    const fullHeight = await measureHeightAsync(this.text);

    // We need to set the state here so we force re-render
    this.measured = true;
    this.fullHeight = fullHeight;
    this.forceUpdate();

    await nextFrameAsync();

    // Get the height of the text now that number of lines has been set
    const limitedHeight = await measureHeightAsync(this.text);
    this.limitedHeight = limitedHeight;

    if (fullHeight > limitedHeight) {
      this.shouldShowMore = true;
      this.forceUpdate();
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
    const { showAllText } = this.state;

    if (this.shouldShowMore && !showAllText) {
      const viewMore = (this.props.renderViewMore || this.renderViewMore);
      return viewMore(this.handlePressViewMore);
    } else if (this.shouldShowMore && showAllText) {
      const viewLess = (this.props.renderViewLess || this.renderViewLess);
      return viewLess(this.handlePressViewLess);
    }
    return null;
  }

  render() {
    const { showAllText } = this.state;
    const { textStyle, numberOfLines, children, ...props } = this.props;

    return (
      <View>
        <Text
          numberOfLines={this.measured && !showAllText ? numberOfLines : 0}
          ref={(text) => { this.text = text; }}
          style={textStyle}
          {...props}
        >
          {children}
        </Text>
        {this.renderFooter()}
      </View>
    );
  }
}

ViewMoreText.propTypes = {
  textStyle: PropTypes.object,
  numberOfLines: PropTypes.number,
  renderViewMore: PropTypes.func,
  renderViewLess: PropTypes.func,
};

ViewMoreText.defaultProps = {
  textStyle: null,
  numberOfLines: 0,
  renderViewMore: null,
  renderViewLess: null,
};


function measureHeightAsync(component) {
  return new Promise(resolve => component.measure((x, y, w, h) => resolve(h)));
}

function nextFrameAsync() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}
