import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Platform, TouchableOpacity, Modal, ActivityIndicator, Share, Linking, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
import { isDataUrl, parseURL } from 'kitsu/common/utils/url';
import { isEmpty } from 'lodash';
import { styles } from './styles';

export class ImageLightbox extends PureComponent {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    visible: PropTypes.bool,
    initialImageIndex: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    onShare: PropTypes.func,
    onDownload: PropTypes.func,
    onOpen: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    initialImageIndex: 0,
    onShare: null,
    onDownload: null,
    onOpen: null,
  }

  shareImage = (url) => {
    if (isEmpty(url)) return;
    const key = Platform.select({ ios: 'url', android: 'message' });
    Share.share({ [key]: url });
  }

  downloadImage = (url) => {
    console.log(url);
  }

  openImage = async (url) => {
    if (isEmpty(url)) return;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      }
    } catch (e) {
      console.log(`Error handling ${url}: ${e}`);
    }
  }

  renderFooter(imageUrls) {
    const { onClose, onShare, onDownload, onOpen } = this.props;
    const shareImage = onShare || this.shareImage;
    const downloadImage = onDownload || this.downloadImage;
    const openImage = onOpen || this.openImage;

    return (currentIndex) => {
      const currentImage = imageUrls[currentIndex];
      const url = currentImage && currentImage.url;

      // Check if we have a remote URL
      const parsed = parseURL(url);
      const isRemoteUrl = parsed && parsed.protocol && parsed.protocol.includes('http');

      return (
        <View style={styles.imageModalFooter}>
          {/* Close */}
          <TouchableOpacity style={styles.iconContainer} onPress={onClose}>
            <Icon
              style={[styles.icon, styles.closeIcon]}
              name={Platform.select({ ios: 'ios-close', android: 'md-close' })}
            />
          </TouchableOpacity>

          {/* Open */}
          {isRemoteUrl &&
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => openImage(url)}
            >
              <Icon
                style={[styles.icon, styles.openIcon]}
                name={Platform.select({ ios: 'ios-open-outline', android: 'md-open' })}
              />
            </TouchableOpacity>
          }

          {/* Share */}
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => shareImage(url)}
          >
            <Icon
              style={styles.icon}
              name={Platform.select({ ios: 'ios-share-outline', android: 'md-share' })}
            />
          </TouchableOpacity>

          {/* Download */}
          {/*
          Disabled for now ...
          Several issues with this at the moment:
            1. Need to find a way to download images to gallery on android.
            2. `CameraRoll` has `saveToCameraRoll` which can save remote urls to iOS only.
                see: https://facebook.github.io/react-native/docs/cameraroll.html#savetocameraroll
            3. To get `CameraRoll.saveToCameraRoll` to work, you need to ask user for permission beforehand, otherwise app just crashes.
          */}
          {/* <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => downloadImage(url)}
          >
            <Icon
              style={styles.icon}
              name={Platform.select({ ios: 'ios-cloud-download-outline', android: 'md-cloud-download' })}
            />
          </TouchableOpacity> */}
        </View>
      );
    };
  }

  renderImage = (props) => {
    const uri = (props && props.source && props.source.uri) || '';

    /*
    Data url images don't work on android with FastImage.
    Thus we have to fallback to a regular image component.

    Same thing is done in `PostImage`

    Relevant PRs:
      - https://github.com/DylanVann/react-native-fast-image/pull/91
      - https://github.com/DylanVann/react-native-fast-image/pull/205
    */
    const ImageComponent = (isDataUrl(uri) && Platform.OS === 'android') ? Image : FastImage;
    return (
      <ImageComponent
        {...props}
      />
    );
  }

  render() {
    const { images, visible, initialImageIndex, onClose, onShare, onDownload } = this.props;

    if (isEmpty(images)) return null;

    const imageUrls = images.map(i => ({
      url: i,
    }));

    // Cap the initialIndexValue between 0 and images.length - 1
    const index = Math.min(images.length - 1, Math.max(initialImageIndex, 0));

    const shareImage = onShare || this.shareImage;

    return (
      <Modal
        visible={visible}
        transparent
        onRequestClose={onClose}
      >
        <ImageViewer
          imageUrls={imageUrls}
          onCancel={onClose}
          onLongPress={i => shareImage(i && i.url)}
          saveToLocalByLongPress={false}
          backgroundColor={'rgba(0,0,0,0.97)'}
          index={index}
          loadingRender={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
          renderImage={this.renderImage}
          renderFooter={this.renderFooter(imageUrls)}
          footerContainerStyle={styles.imageModalFooterContainer}
        />
      </Modal>
    );
  }
}
