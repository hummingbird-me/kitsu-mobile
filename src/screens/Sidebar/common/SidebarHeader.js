import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { defaultCover } from 'kitsu/constants/app/';
import PropTypes from 'prop-types';

const SidebarHeader = ({ navigation, headerTitle, coverImage }) => (
  <View style={styles.absolute}>
    <ProgressiveImage
      hasOverlay
      style={styles.header}
      source={{ uri: (coverImage && coverImage.large) || defaultCover }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingTop: 30,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ width: 30 }}>
          <TouchableOpacity
            style={{
              marginTop: 3,
              paddingHorizontal: 4,
              paddingVertical: 8,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.goBack()}
          >
            <Icon name="ios-arrow-back" color={'white'} size={22} />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            backgroundColor: 'transparent',
            color: 'white',
            fontFamily: 'OpenSans',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          {headerTitle}
        </Text>
        <View style={{ width: 30 }}>
          <View />
        </View>
      </View>
    </ProgressiveImage>
  </View>
);

SidebarHeader.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
};

SidebarHeader.defaultProps = {
  headerTitle: 'Settings',
};

const styles = {
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    height: 77 + Platform.select({ ios: 0, android: 4 }),
  },
};

const mapStateToProps = ({ user }) => ({
  coverImage: user.currentUser.coverImage,
});

export default connect(mapStateToProps, {})(SidebarHeader);
