import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'native-base';
import PropTypes from 'prop-types';

import { MediaFilter, MediaFilterMenu, MediaSelectionGrid } from 'kitsu/components/MediaUploader';

export default class MediaUploadScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <Button transparent color="white" onPress={navigation.goBack}>
        <Text style={styles.headerButton}>Cancel</Text>
      </Button>
    ),
    title: (
      <MediaFilter
        filterContext={(navigation.state.params || {}).filterContext}
        onPress={(navigation.state.params || {}).onFilterPress}
      />
    ),
    headerRight: (
      <Button transparent color="white" onPress={navigation.goBack}>
        <Text style={styles.headerButton}>Done</Text>
      </Button>
    ),
  });

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  state = {
    filterMenuOpen: false,
    filterContext: 'Camera Roll',
    selectedImages: [],
  }

  componentDidMount() {
    const { filterContext } = this.state;

    this.props.navigation.setParams({
      filterContext,
      onFilterPress: () => this.setState({ filterMenuOpen: !this.state.filterMenuOpen }),
    });
  }

  onFilterContextChanged = (filterContext) => {
    this.setState({
      filterContext,
      filterMenuOpen: false,
    });

    // Update the filter context in the header
    this.props.navigation.setParams({ filterContext });
  }

  render() {
    const { filterContext, filterMenuOpen } = this.state;

    return (
      <View>
        <MediaSelectionGrid
          filterContext={filterContext}
          onSelectedImagesChanged={selectedImages => this.setState({ selectedImages })}
        />

        { filterMenuOpen &&
          <MediaFilterMenu
            filterContext={filterContext}
            onFilterContextChanged={this.onFilterContextChanged}
          />
        }
      </View>
    );
  }
}

const styles = {
  headerButton: {
    color: 'white',
    fontFamily: 'OpenSans',
  },
};
