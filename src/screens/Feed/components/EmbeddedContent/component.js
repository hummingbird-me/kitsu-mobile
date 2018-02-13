import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes, WebView, Platform } from 'react-native';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import YouTube from 'react-native-youtube';

export class EmbeddedContent extends PureComponent {
  // The reason for the combination of string or number is that
  // sometimes the embeds return width/height as strings
  // othertimes as numbers ...
  static typeStringNumber = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]);

  static propTypes = {
    embed: PropTypes.shape({
      kind: PropTypes.string.isRequired,
      site: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      image: PropTypes.shape({
        url: PropTypes.string.isRequired,
        width: this.typeStringNumber,
        height: this.typeStringNumber,
      }),
      video: PropTypes.shape({
        url: PropTypes.string.isRequired,
        width: this.typeStringNumber,
        height: this.typeStringNumber,
      }),
    }).isRequired,
    style: ViewPropTypes.style,
    maxWidth: PropTypes.number.isRequired,
    minWidth: PropTypes.number,
    borderRadius: PropTypes.number,
    overlayColor: PropTypes.string,
  }

  static defaultProps = {
    style: null,
    minWidth: null,
    borderRadius: 0,
    overlayColor: null,
  }

  /**
   * Render an image embed.
   * This will render the image with given image width or maxWidth if it exceeds it.
   *
   * @param {object} embed
   * @returns The image component
   */
  renderImage(embed) {
    if (!embed.image) return null;

    const { maxWidth, minWidth, borderRadius, overlayColor } = this.props;
    const imageWidth = embed.image.width || maxWidth;

    let width = parseInt(imageWidth, 10);
    if (minWidth && width < minWidth) width = minWidth;
    if (width > maxWidth) width = maxWidth;

    // PostImage will auto scale the image
    return (
      <PostImage
        uri={embed.image.url}
        width={width}
        borderRadius={borderRadius}
        overlayColor={overlayColor}
      />
    );
  }

  renderYoutube(embed) {
    if (!embed.video) return null;
    const { maxWidth } = this.props;
    const video = embed.video;

    const chunks = video.url.split('/');
    const youTubeVideoId = chunks[chunks.length - 1];

    const videoWidth = video.width && parseInt(video.width, 10);
    const videoHeight = video.height && parseInt(video.height, 10);

    // Get the scaled height
    const height = (videoHeight && videoWidth) ? (videoHeight / videoWidth) * maxWidth : 300;
    const style = { width: maxWidth, height: Math.max(200, height) };

    return (
      Platform.OS === 'ios' ?
        <YouTube
          videoId={youTubeVideoId}
          modestBranding
          rel={false}
          style={style}
        />
        :
        <WebView
          style={style}
          source={{ uri: `${video.url}?rel=0&autoplay=0&showinfo=1&controls=1&modestbranding=1` }}
        />
    );
  }

  renderItem(embed) {
    if (embed.video && ((embed.site && embed.site.name === 'YouTube') || embed.site_name === 'YouTube')) {
      return this.renderYoutube(embed);
    }

    if (embed.kind && (embed.kind.includes('image') || embed.kind.includes('gif'))) {
      return this.renderImage(embed);
    }

    return null;
  }

  render() {
    const { style, embed } = this.props;
    return (
      <View style={style}>
        {this.renderItem(embed)}
      </View>
    );
  }
}
