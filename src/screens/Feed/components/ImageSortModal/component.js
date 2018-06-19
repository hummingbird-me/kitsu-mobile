import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Modal, FlatList, Keyboard, TouchableOpacity, Dimensions, Text, ActivityIndicator, ScrollView } from 'react-native';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { isNil } from 'lodash';
import { prettyBytes } from 'kitsu/utils/prettyBytes';
import { styles } from './styles';


export class ImageSortModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    onCancelPress: PropTypes.func,
    onAddPress: PropTypes.func,
    onChangeImageOrder: PropTypes.func,
    onRemoveImage: PropTypes.func,
    images: PropTypes.array,
    disableAddButton: PropTypes.bool,
    disableRemoveButton: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    onCancelPress: () => {},
    onAddPress: () => {},
    onChangeImageOrder: () => {},
    onRemoveImage: () => {},
    images: [],
    disableAddButton: false,
    disableRemoveButton: false,
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

  handleSortPress(index, direction) {
    const { images, onChangeImageOrder } = this.props;
    if (direction === 'up' && index - 1 >= 0) {
      onChangeImageOrder(index, index - 1);
    } else if (direction === 'down' && index + 1 < images.length) {
      onChangeImageOrder(index, index + 1);
    }
  }

  handleRemoveImage(index) {
    const { onRemoveImage, images } = this.props;
    if (index >= 0 && index < images.length) {
      onRemoveImage(index);
    }
  }

  renderItem = ({ item, index }) => {
    const { disableRemoveButton } = this.props;
    const ratio = (item.height || 1) / (item.width || 2);
    const width = Dimensions.get('window').width;
    const height = Math.min(500, width * ratio);

    const uri = item.uri || (item.content && item.content.original);
    const buttonWidth = disableRemoveButton ? '50%' : '32%';

    return (
      <View key={uri}>
        {!isNil(item.size) &&
          <View style={styles.sizeIndicatorContainer}>
            <Text style={styles.sizeIndicator}>
              {prettyBytes(item.size)}
            </Text>
          </View>
        }
        <View style={styles.imageContainer}>
          <FastImage
            key={uri}
            source={{ uri }}
            style={{ width, height }}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.buttonContainer}>
          {!disableRemoveButton &&
            <TouchableOpacity
              onPress={() => this.handleRemoveImage(index)}
              style={[styles.button, { width: buttonWidth }]}
            >
              <Icon name="md-close" style={[styles.icon, styles.closeIcon]} />
            </TouchableOpacity>
          }
          <TouchableOpacity
            onPress={() => this.handleSortPress(index, 'up')}
            style={[styles.button, { width: buttonWidth }]}
          >
            <Icon name="ios-arrow-up" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleSortPress(index, 'down')}
            style={[styles.button, { width: buttonWidth }]}
          >
            <Icon name="ios-arrow-down" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const { visible, images, disableAddButton } = this.props;

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
          rightButtonTitle={!disableAddButton && 'Add'}
          rightButtonAction={this.handleAddPress}
        />
        <ScrollView style={styles.container}>
          <FlatList
            listKey="images"
            data={images}
            ItemSeparatorComponent={() => <View style={styles.seperator} />}
            keyExtractor={item => item.uri}
            renderItem={this.renderItem}
          />
        </ScrollView>
      </Modal>
    );
  }
}
