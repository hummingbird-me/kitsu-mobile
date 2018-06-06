import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Platform, TouchableOpacity, Modal, ActivityIndicator, CameraRoll, Share } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
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
  }

  static defaultProps = {
    visible: false,
    initialImageIndex: 0,
    onShare: null,
    onDownload: null,
  }

  shareImage = (image) => {
    // This only shares the url
    const url = typeof image === 'string' ? image : (image && image.url) || null;
    if (isEmpty(url)) return;
    Share.share({ url });
  }

  downloadImage = (image) => {
    console.log(image);
    const url = typeof image === 'string' ? image : (image && image.url) || null;
    if (isEmpty(url)) return;

    CameraRoll.saveToCameraRoll(url);
  }

  renderFooter(imageUrls) {
    const { onClose, onShare, onDownload } = this.props;
    const shareImage = onShare || this.shareImage;
    const downloadImage = onDownload || this.downloadImage;

    return currentIndex => (
      <View style={styles.imageModalFooter}>
        {/* Close */}
        <TouchableOpacity style={styles.iconContainer} onPress={onClose}>
          <Icon
            style={[styles.icon, styles.closeIcon]}
            name={Platform.select({ ios: 'ios-close', android: 'md-close' })}
          />
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => shareImage(imageUrls[currentIndex])}
        >
          <Icon
            style={[styles.icon, styles.shareIcon]}
            name={Platform.select({ ios: 'ios-share-outline', android: 'md-share' })}
          />
        </TouchableOpacity>

        {/* Download */}
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => downloadImage(imageUrls[currentIndex])}
        >
          <Icon
            style={[styles.icon, styles.downloadIcon]}
            name={Platform.select({ ios: 'ios-cloud-download-outline', android: 'md-cloud-download' })}
          />
        </TouchableOpacity>
      </View>
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
      <Modal visible={visible} transparent>
        <ImageViewer
          imageUrls={imageUrls}
          onCancel={onClose}
          onLongPress={shareImage}
          saveToLocalByLongPress={false}
          backgroundColor={'rgba(0,0,0,0.97)'}
          index={index}
          loadingRender={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
          renderImage={props => (
            <FastImage
              {...props}
            />
          )}
          renderFooter={this.renderFooter(imageUrls)}
          footerContainerStyle={styles.imageModalFooterContainer}
        />
      </Modal>
    );
  }
}
