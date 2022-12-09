import React, { PureComponent } from 'react';
import { View, Modal, FlatList, TouchableOpacity, Text } from 'react-native';
import { PropTypes } from 'prop-types';
import { isEmpty, uniq } from 'lodash';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import { EmbedItem } from 'kitsu/screens/Feed/components/PostCreator/components/EmbedItem';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';

export class EmbedModal extends PureComponent {
  static propTypes = {
    urls: PropTypes.arrayOf(PropTypes.string).isRequired,
    currentEmbed: PropTypes.string,
    visible: PropTypes.bool,
    onCancelPress: PropTypes.func,
    onEmbedSelect: PropTypes.func,
  }

  static defaultProps = {
    currentEmbed: null,
    visible: false,
    onCancelPress: () => { },
    onEmbedSelect: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: props.currentEmbed,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (!this.state.selected || this.props.currentEmbed !== props.currentEmbed) {
      this.setState({
        selected: props.currentEmbed,
      });
    }
  }

  handleDonePress = () => {
    const { onEmbedSelect } = this.props;
    if (onEmbedSelect) {
      onEmbedSelect(this.state.selected);
    }
    this.setState({ selected: null });
  }

  handleCancelPress = () => {
    const { onCancelPress } = this.props;
    onCancelPress();
    this.setState({ selected: null });
  }

  renderItem = ({ item: url }) => {
    const { selected } = this.state;
    const isSelected = selected && url.toLowerCase() === selected.toLowerCase();
    return (
      <TouchableOpacity
        onPress={() => this.setState({ selected: url })}
        style={styles.item}
      >
        <View style={[styles.itemContainer, isSelected && styles.item__selected]}>
          <Text style={[styles.itemUrl, isSelected && styles.itemUrl__selected]}>{url}</Text>
          <View style={[styles.checkmark, isSelected && styles.checkmark__selected]}>
            <Icon name="ios-checkmark" color="#FFFFFF" style={styles.checkmarkIcon} />
          </View>
        </View>
        <EmbedItem url={url} disabled />
      </TouchableOpacity>
    );
  }

  render() {
    const { visible, urls } = this.props;

    const filtered = uniq(urls || []).filter(u => !isEmpty(u));

    return (
      <Modal
        animationType="slide"
        visible={visible}
        transparent={false}
        onRequestClose={this.handleCancelPress}
      >
        <View style={styles.container}>
          <ModalHeader
            title="Select an Embed"
            leftButtonTitle="Cancel"
            leftButtonAction={this.handleCancelPress}
            rightButtonTitle="Done"
            rightButtonAction={this.handleDonePress}
          />
          <FlatList
            listKey="embeds"
            data={filtered}
            ItemSeparatorComponent={() => <View style={styles.seperator} />}
            keyExtractor={item => item}
            renderItem={this.renderItem}
          />
        </View>
      </Modal>
    );
  }
}
