import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { defaultCover as defaultCoverUri, statusBarHeight, navigationBarHeight } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { isX, paddingX } from 'kitsu/utils/isX';
import PropTypes from 'prop-types';
import { getImgixCoverImage } from 'kitsu/utils/imgix';

const SidebarHeader = ({ headerTitle, coverImage, onBackPress, hideCover }) => {
  const goBack = onBackPress;
  const BackView = hideCover ? View : ProgressiveImage;
  return (
    <View style={styles.absolute}>
      <BackView
        hasOverlay
        style={[styles.header, hideCover && styles.solidColor]}
        source={{ uri: getImgixCoverImage(coverImage) || defaultCoverUri }}
      >
        <View style={styles.header}>
          <View style={{ width: 30 }}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => goBack()}
            >
              <Icon name="ios-arrow-back" color={colors.white} size={22} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{headerTitle}</Text>
          <View style={{ width: 30 }}>
            <View />
          </View>
        </View>
      </BackView>
    </View>
  );
};

SidebarHeader.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  coverImage: PropTypes.object,
  onBackPress: PropTypes.func,
  hideCover: PropTypes.bool,
};

SidebarHeader.defaultProps = {
  headerTitle: 'Settings',
  coverImage: null,
  onBackPress: null,
  hideCover: false,
};

const styles = {
  container: {
    backgroundColor: colors.listBackPurple,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    elevation: 3,
    zIndex: 2,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    height: navigationBarHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: navigationBarHeight + statusBarHeight + (isX ? paddingX : 0),
  },
  header: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.select({ ios: 77, android: 72 }),
  },
  solidColor: {
    backgroundColor: colors.listBackPurple,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    elevation: 3,
  },
  backButton: {
    marginTop: 3,
    paddingHorizontal: 4,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: colors.white,
    fontFamily: 'OpenSans',
    fontSize: 14,
    fontWeight: 'bold',
  },
};

const mapStateToProps = ({ user }) => ({
  coverImage: user.currentUser.coverImage,
});

export default connect(mapStateToProps, {})(SidebarHeader);
