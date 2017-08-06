import React from 'react';
import { Text, Dimensions } from 'react-native';
import htmlparser from 'htmlparser2-without-node-native';
import entities from 'entities';
import YouTube from 'react-native-youtube';

import AutoSizedImage from './AutoSizedImage';

const defaultOpts = {
  lineBreak: '',
  paragraphBreak: '\n',
  bullet: '\u2022 ',
  TextComponent: Text,
  textComponentProps: null,
  NodeComponent: Text,
  nodeComponentProps: null,
};
const screenWidth = Dimensions.get('window').width;

const Img = (props) => {
  const width = Number(props.attribs.width) || Number(props.attribs['data-width']) || 0;
  const height = Number(props.attribs.height) || Number(props.attribs['data-height']) || 0;

  const imgStyle = {
    width,
    height,
    marginLeft: -10,
  };
  const source = {
    uri: props.attribs.src,
    width,
    height,
  };
  return <AutoSizedImage source={source} style={imgStyle} />;
  // return <Text>Image</Text>;
};

export default function htmlToElement(rawHtml, customOpts = {}, done) {
  const opts = {
    ...defaultOpts,
    ...customOpts,
  };

  function domToElement(dom, parent) {
    if (!dom) return null;

    const renderNode = opts.customRenderer;

    return dom.map((node, index, list) => {
      if (renderNode) {
        const rendered = renderNode(node, index, list, parent, domToElement);
        if (rendered || rendered === null) return rendered;
      }

      const { TextComponent } = opts;
      if (node.type == 'text') {
        return (
          <TextComponent
            {...opts.textComponentProps}
            key={index}
            style={parent ? opts.styles[parent.name] : null}
          >
            {entities.decodeHTML(node.data)}
          </TextComponent>
        );
      }

      if (node.type === 'tag') {
        if (node.name === 'img') {
          return <Img key={index} attribs={node.attribs} />;
        }

        if (node.name === 'iframe' && node.attribs.src.includes('youtube')) {
          const video = node.attribs.src.match(/embed\/(.*)\?/i)[1];
          return (
            <YouTube
              videoId={video} // The YouTube video ID
              play={false} // control playback of video with true/false
              fullscreen={false} // control whether the video should play in fullscreen or inline
              loop={false} // control whether the video should loop when ended
              style={{
                alignSelf: 'stretch',
                marginLeft: -10,
                height: 250,
                width: screenWidth,
                backgroundColor: 'black',
              }}
            />
          );
        }

        let linkPressHandler = null;
        if (node.name == 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href));
        }

        let linebreakBefore = null;
        let linebreakAfter = null;
        if (opts.addLineBreaks) {
          switch (node.name) {
            case 'pre':
              linebreakBefore = opts.lineBreak;
              break;
            case 'p':
              if (index < list.length - 1) {
                linebreakAfter = opts.paragraphBreak;
              }
              break;
            case 'br':
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
              linebreakAfter = opts.lineBreak;
              break;
          }
        }

        let listItemPrefix = null;
        if (node.name == 'li') {
          if (parent.name == 'ol') {
            listItemPrefix = `${index + 1}. `;
          } else if (parent.name == 'ul') {
            listItemPrefix = opts.bullet;
          }
        }

        const { NodeComponent } = opts;

        return (
          <NodeComponent {...opts.nodeComponentProps} key={index} onPress={linkPressHandler}>
            {linebreakBefore}
            {listItemPrefix}
            {domToElement(node.children, node)}
            {linebreakAfter}
          </NodeComponent>
        );
      }
    });
  }

  const handler = new htmlparser.DomHandler((err, dom) => {
    if (err) done(err);
    done(null, domToElement(dom));
  });
  const parser = new htmlparser.Parser(handler);
  parser.write(rawHtml);
  parser.done();
}
