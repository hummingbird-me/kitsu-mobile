import React from 'react';
import { View, Dimensions, Text, Image, Platform} from 'react-native';
import { Button, Icon, Left, Right } from 'native-base';
import ProgressiveImage from '../../../components/ProgressiveImage';
import PropTypes from 'prop-types';

const SidebarHeader = ({ navigation, headerTitle }) => (
  <View style={styles.absolute}>
    <ProgressiveImage hasOverlay style={styles.header} source={{ uri: 'https://fubukinofansub.files.wordpress.com/2011/12/cover-03-04.jpg' }}>
      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 30, alignItems: 'center' }}>
        <Left>
          <Button transparent color="white" onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={{ color: 'white' }} />
          </Button>
        </Left>
        <Text style={{ backgroundColor: 'transparent', color: 'white', fontFamily: 'OpenSans', fontSize: 14, fontWeight: 'bold' }}>
          {headerTitle}
        </Text>
        <Right>
          <View />
        </Right>
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
    height: 77 + Platform.select({ ios: 0, android: 4 })
  },
};
export default SidebarHeader;
