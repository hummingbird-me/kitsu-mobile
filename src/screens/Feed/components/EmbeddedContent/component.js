import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes, WebView, Platform, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { PostImage } from 'kitsu/screens/Feed/components/PostImage';
import YouTube from 'react-native-youtube';
import { StyledText } from 'kitsu/components/StyledText';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import defaultAvatar from 'kitsu/assets/img/default_avatar.png';
import { startCase } from 'lodash';
import { styles } from './styles';

export class EmbeddedContent extends PureComponent {
  // The reason for the combination of string or number is that
  // sometimes the embeds return width/height as strings
  // othertimes as numbers ...
  static typeStringNumber = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]);

  // Same case here
  static typeStringImage = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      width: this.typeStringNumber,
      height: this.typeStringNumber,
    }),
  ]);

  static propTypes = {
    embed: PropTypes.shape({
      kind: PropTypes.string.isRequired,
      site: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      image: this.typeStringImage,
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
    navigation: PropTypes.object.isRequired,
  }

  static defaultProps = {
    style: null,
    minWidth: null,
    borderRadius: 0,
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

    const { maxWidth, minWidth, borderRadius } = this.props;
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

  renderKitsu(embed) {
    if (embed.url) {
      if (embed.url.includes('anime') || embed.url.includes('manga')) return this.renderMedia(embed);
      if (embed.url.includes('users')) return this.renderUser(embed);
    }

    return null;
  }

  renderMedia(embed) {
    const id = embed.kitsu && embed.kitsu.id;
    if (!id) return null;

    const { navigation, maxWidth } = this.props;
    const type = embed.url && embed.url.includes('anime') ? 'anime' : 'manga';

    return (
      <TouchableOpacity
        style={{ width: maxWidth }}
        onPress={() => navigation.navigate('MediaPages', { mediaId: id, mediaType: type })}
      >
        <Layout.RowWrap style={styles.kitsuContent}>
          {/* Make sure embed image doesn't break if they change it */}
          {typeof embed.image === 'string' &&
            <ProgressiveImage
              source={{ uri: embed.image || '' }}
              style={styles.mediaPoster}
            />
          }
          <Layout.RowMain>
            <StyledText color="dark" size="small" numberOfLines={1} bold>{embed.title || '-'}</StyledText>
            <StyledText color="dark" size="xxsmall" numberOfLines={1} bold textStyle={{ paddingVertical: 4 }}>
              {startCase(type)}
            </StyledText>
            <StyledText color="dark" size="xsmall" numberOfLines={5}>{embed.description || '-'}</StyledText>
          </Layout.RowMain>
        </Layout.RowWrap>
      </TouchableOpacity>
    );
  }

  renderUser(embed) {
    const id = embed.kitsu && embed.kitsu.id;
    if (!id) return null;

    const { navigation, maxWidth } = this.props;

    const image = (embed.image.includes('http') && { uri: embed.image }) || defaultAvatar;

    return (
      <TouchableOpacity
        style={{ width: maxWidth }}
        onPress={() => navigation.navigate('ProfilePages', { userId: id })}
      >
        <Layout.RowWrap style={styles.kitsuContent} alignItems="center">
          {/* Make sure embed image doesn't break if they change it */}
          {typeof embed.image === 'string' &&
            <FastImage
              source={image}
              style={styles.userPoster}
            />
          }
          <Layout.RowMain>
            <StyledText color="dark" size="small" numberOfLines={2} bold>{embed.title || '-'}</StyledText>
          </Layout.RowMain>
        </Layout.RowWrap>
      </TouchableOpacity>
    );
  }

  renderItem(embed) {
    if (embed.video && ((embed.site && embed.site.name === 'YouTube') || embed.site_name === 'YouTube')) {
      return this.renderYoutube(embed);
    }

    if (embed.kind) {
      if (embed.kind.includes('image') || embed.kind.includes('gif')) {
        return this.renderImage(embed);
      }

      if (embed.kind.includes('kitsu')) {
        return this.renderKitsu(embed);
      }
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
