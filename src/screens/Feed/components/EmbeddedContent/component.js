import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import { YouTube } from 'react-native-youtube';

export class EmbeddedContent extends PureComponent {
  static propTypes = {
    embed: PropTypes.shape({
      kind: PropTypes.string.isRequired,
      site: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      image: PropTypes.shape({
        url: PropTypes.string.isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
      }),
      video: PropTypes.shape({
        url: PropTypes.string.isRequired,
        width: PropTypes.number,
        height: PropTypes.number,
      }),
    }).isRequired,
    style: ViewPropTypes.style,
    maxWidth: PropTypes.number.isRequired,
    minWidth: PropTypes.number,
  }

  static defaultProps = {
    style: null,
    minWidth: null,
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

    const { maxWidth, minWidth } = this.props;
    const imageWidth = embed.image.width || maxWidth;

    let width = imageWidth;
    if (minWidth && width < minWidth) width = minWidth;
    if (width > maxWidth) width = maxWidth;

    // PostImage will auto scale the image
    return <PostImage uri={embed.image.url} width={width} />;
  }

  renderYoutube(embed) {
    if (!embed.video) return null;
    const video = embed.video;
    const chunks = video.url.split('/');
    const youTubeVideoId = chunks[chunks.length - 1];

    // Get the scaled height
    const height = (video.height && video.width) ? (video.height / video.width) * maxWidth : 300;

    return (
      <YouTube
        videoId={youTubeVideoId}
        modestBranding
        rel={false}
        style={{ width: maxWidth, height }}
      />
    );
  }

  renderItem(embed) {
    if (embed.video && embed.site && embed.site.name === 'YouTube') return this.renderYoutube(embed);
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
