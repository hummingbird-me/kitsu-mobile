import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Modal, FlatList, Keyboard, TouchableOpacity, Dimensions, Text, ActivityIndicator, ScrollView } from 'react-native';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import FastImage from 'react-native-fast-image';
import { styles } from './styles';


export class ImageSortModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    onCancelPress: PropTypes.func,
    onAddPress: PropTypes.func,
    images: PropTypes.array,
  }

  static defaultProps = {
    visible: false,
    onCancelPress: () => {},
    onAddPress: () => {},
    images: [],
  }

  constructor(props) {
    super(props);
    this.mounted = false;
  }

  state = {
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleCancelPress = () => {
    const { onCancelPress } = this.props;
    onCancelPress();
  }

  handleAddPress = () => {
    const { onAddPress } = this.props;
    onAddPress();
  }

  renderItem(image) {
    const ratio = (image.height || 1) / (image.width || 2);
    const width = Dimensions.get('window').width;
    const height = Math.min(300, width * ratio);

    console.log(image);
    return (
      <FastImage
        source={{ uri: image.uri }}
        style={{ width, height }}
        resizeMode={'cover'}
      />
    );
  }

  render() {
    const { visible, images } = this.props;

    return (
      <Modal
        animationType="slide"
        visible={visible}
        transparent={false}
        onRequestClose={this.handleCancelPress}
      >
        <ModalHeader
          title="Images"
          leftButtonTitle="Back"
          leftButtonAction={this.handleCancelPress}
          rightButtonTitle="Add"
          rightButtonAction={this.handleAddPress}
        />
        <ScrollView style={{ flex: 1 }}>
          <FlatList
            listKey="images"
            data={images}
            ItemSeparatorComponent={() => <View style={styles.seperator} />}
            keyExtractor={item => item.uri}
            renderItem={({ item }) => this.renderItem(item)}
          />
        </ScrollView>
      </Modal>
    );
  }
}
