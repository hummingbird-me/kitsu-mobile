import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Modal, FlatList, TouchableHighlight, Text, Keyboard } from 'react-native';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import { SearchBox } from 'kitsu/components/SearchBox';
import { isEmpty, isNull } from 'lodash';
import { styles } from './styles';

const apiKey = 'dc6zaTOxFJmzC';
const endpoint = 'https://api.giphy.com/v1/gifs/search?';

export class GiphyModal extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    onCancelPress: PropTypes.func,
    onDonePress: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    onCancelPress: null,
    onDonePress: null,
  }

  state = {
    currentPick: null,
    gifs: [],
    query: '',
  }

  handlePicker = (currentPick) => {
    this.setState({ currentPick });
  }

  handleOnDonePress = () => {
    this.props.onDonePress(this.state.currentPick);
  }

  handleSearchStateChange = (query) => {
    this.setState({ query }, () => {
      this.searchGIF(query);
    });
  }

  searchGIF = async (query) => {
    // Reset on empty query
    if (isEmpty(query)) {
      this.setState({ gifs: [] });
      return;
    }

    const params = `api_key=${apiKey}&q=${query}`;
    const url = `${endpoint}${params}`;

    // Fetch the GIFS!
    try {
      const response = await fetch(url);
      const giphy = await response.json();
      const gifs = giphy.data.map(e => e.images.original);

      // User might have cleared keyboard but results come in after
      if (!isEmpty(query)) this.setState({ gifs });
    } catch (e) {
      console.log(e);
    }
  }

  renderItem({ item }) {
    return (
      <Text>
        {item.url}
      </Text>
    );
  }

  render() {
    const { visible, onCancelPress } = this.props;
    const { gifs, currentPick } = this.state;

    return (
      <Modal
        animationType="slide"
        visible={visible}
        transparent={false}
        onRequestClose={onCancelPress}
      >
        <ModalHeader
          title="Giphy Search"
          leftButtonTitle="Cancel"
          leftButtonAction={onCancelPress}
          rightButtonTitle="Done"
          rightButtonAction={this.handleOnDonePress}
          rightButtonDisabled={isNull(currentPick)}
        />
        <View>
          <View style={styles.searchBoxContainer}>
            <SearchBox
              placeholder={'Search for a GIF'}
              searchIconOffset={116}
              style={styles.searchBox}
              value={this.state.query}
              onChangeText={text => this.handleSearchStateChange(text)}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <FlatList
            data={gifs}
            ItemSeparatorComponent={() => <View />}
            renderItem={this.renderItem}
          />
        </View>
      </Modal>
    );
  }
}
