import React, { Component } from 'react';
import { Linking, StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import htmlToElement from './htmlToElement';

const boldStyle = { fontWeight: '500' };
const italicStyle = { fontStyle: 'italic' };
const codeStyle = { fontFamily: 'Menlo' };

const baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  pre: codeStyle,
  code: codeStyle,
  a: {
    fontWeight: '500',
    color: '#007AFF',
  },
  h1: { fontWeight: '500', fontSize: 36 },
  h2: { fontWeight: '500', fontSize: 30 },
  h3: { fontWeight: '500', fontSize: 24 },
  h4: { fontWeight: '500', fontSize: 18 },
  h5: { fontWeight: '500', fontSize: 14 },
  h6: { fontWeight: '500', fontSize: 12 },
});

const htmlToElementOptKeys = [
  'lineBreak',
  'paragraphBreak',
  'bullet',
  'TextComponent',
  'textComponentProps',
  'NodeComponent',
  'nodeComponentProps',
];

class HtmlView extends Component {
  constructor() {
    super();
    this.state = {
      element: null,
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.startHtmlRender(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.startHtmlRender(nextProps.value);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  startHtmlRender(value) {
    if (!value) {
      this.setState({ element: null });
    }

    const opts = {
      addLineBreaks: this.props.addLineBreaks,
      linkHandler: this.props.onLinkPress,
      styles: Object.assign({}, baseStyles, this.props.stylesheet),
      customRenderer: this.props.renderNode,
    };

    htmlToElementOptKeys.forEach((key) => {
      if (typeof this.props[key] !== 'undefined') {
        opts[key] = this.props[key];
      }
    });

    htmlToElement(value, opts, (err, element) => {
      if (err) {
        this.props.onError(err);
      }

      if (this.mounted) {
        this.setState({ element });
      }
    });
  }

  render() {
    const { RootComponent } = this.props;
    if (this.state.element) {
      return (
        <RootComponent
          {...this.props.rootComponentProps}
          children={this.state.element}
          style={this.props.style}
        />
      );
    }
    return <RootComponent {...this.props.rootComponentProps} style={this.props.style} />;
  }
}

HtmlView.propTypes = {
  addLineBreaks: PropTypes.bool,
  bullet: PropTypes.string,
  lineBreak: PropTypes.string,
  NodeComponent: PropTypes.func,
  nodeComponentProps: PropTypes.object,
  onError: PropTypes.func,
  onLinkPress: PropTypes.func,
  paragraphBreak: PropTypes.string,
  renderNode: PropTypes.func,
  RootComponent: PropTypes.func,
  rootComponentProps: PropTypes.object,
  style: ViewPropTypes.style,
  stylesheet: PropTypes.object,
  TextComponent: PropTypes.func,
  textComponentProps: PropTypes.object,
  value: PropTypes.string,
};

HtmlView.defaultProps = {
  addLineBreaks: true,
  onLinkPress: url => Linking.openURL(url),
  onError: console.error.bind(console),
  RootComponent: View,
};

export default HtmlView;
