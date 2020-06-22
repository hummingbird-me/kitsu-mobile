import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { ProgressiveImage } from 'app/components/ProgressiveImage';
import { defaultCover as defaultCoverUri, statusBarHeight, navigationBarHeight } from 'app/constants/app';
import * as colors from 'app/constants/colors';
import { isX, paddingX } from 'app/utils/isX';
import PropTypes from 'prop-types';
import { getImgixCoverImage } from 'app/utils/imgix';

const SidebarHeader = ({ headerTitle, coverImage, onBackPress }) => {
  const goBack = onBackPress;
  return (
    <View style={styles.container}>
      <ProgressiveImage
        hasOverlay
        style={styles.headerContainer}
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
      </ProgressiveImage>
    </View>
  );
};

SidebarHeader.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  coverImage: PropTypes.object,
  onBackPress: PropTypes.func,
};

SidebarHeader.defaultProps = {
  headerTitle: 'Settings',
  coverImage: null,
  onBackPress: null,
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
    height: navigationBarHeight + statusBarHeight + (isX ? paddingX : 0),
  },
  header: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: 'row',
    height: navigationBarHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
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
