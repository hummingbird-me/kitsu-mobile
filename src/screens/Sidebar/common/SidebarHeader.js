import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { defaultCover as defaultCoverUri } from 'kitsu/constants/app/';
import * as colors from 'kitsu/constants/colors';
import { isX, paddingX } from 'kitsu/utils/isX';
import PropTypes from 'prop-types';
import { getImgixCoverImage } from 'kitsu/utils/coverImage';

const SidebarHeader = ({ navigation, headerTitle, coverImage, onBackPress }) => {
  const goBack = onBackPress || navigation.goBack;
  return (
    <View style={styles.absolute}>
      <ProgressiveImage
        hasOverlay
        style={styles.header}
        source={{ uri: getImgixCoverImage(coverImage) || defaultCoverUri }}
      >
        <View style={styles.headerContainer}>
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
  navigation: PropTypes.object.isRequired,
  coverImage: PropTypes.object,
  onBackPress: PropTypes.func,
};

SidebarHeader.defaultProps = {
  headerTitle: 'Settings',
  coverImage: null,
  onBackPress: null,
};

const styles = {
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    height: Platform.select({ ios: 77, android: 72 }),
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: isX ? paddingX / 2 : 0,
    marginTop: 30,
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
