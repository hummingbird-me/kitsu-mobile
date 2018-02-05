import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes, WebView, Platform } from 'react-native';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import YouTube from 'react-native-youtube';

export class EmbeddedContent extends PureComponent {
  static propTypes = {
    embed: PropTypes.shape({
      kind: PropTypes.string.isRequired,
      site: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      image: PropTypes.shape({
        url: PropTypes.string.isRequired,
        width: PropTypes.string,
        height: PropTypes.string,
      }),
      video: PropTypes.shape({
        url: PropTypes.string.isRequired,
        width: PropTypes.string,
        height: PropTypes.string,
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

    let width = imageWidth;
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

    // Get the scaled height
    const height = (video.height && video.width) ? (video.height / video.width) * maxWidth : 300;
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
    if (embed.kind.includes('image') || embed.kind.includes('gif')) return this.renderImage(embed);

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
