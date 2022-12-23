import React, { PureComponent } from 'react';
import { View, Modal, FlatList, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyledText } from 'kitsu/components/StyledText';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import { styles } from './styles';


const ModalMain = props => <View style={styles.modalMain} {...props} />;

interface PickerRowProps {
  isPicked?: boolean;
  title?: string;
  description?: string;
  onPress?(...args: unknown[]): unknown;
}

const PickerRow = ({
  isPicked,
  title,
  description,
  onPress
}: PickerRowProps) => (
  <TouchableHighlight onPress={onPress}>
    <View style={styles.pickerRow}>
      <Layout.RowWrap alignItems="center">
        <View style={[styles.pickerIconCircle, isPicked && styles.pickerIconCircle__isPicked]}>
          {isPicked && <Icon name="ios-checkmark" color="#FFFFFF" style={styles.pickerIcon} />}
        </View>
        <Layout.RowMain>
          <StyledText color="dark" size="small" bold>{title}</StyledText>
          <StyledText color="dark" size="xsmall">{description}</StyledText>
        </Layout.RowMain>
      </Layout.RowWrap>
    </View>
  </TouchableHighlight>
);

PickerRow.defaultProps = {
  isPicked: false,
  title: '',
  description: null,
  onPress: null,
};

const PickerRowSeparator = () => <View style={styles.rowPickerSeparator} />;

interface PickerModalProps {
  visible?: boolean;
  onCancelPress?(...args: unknown[]): unknown;
  onDonePress?(...args: unknown[]): unknown;
  data?: unknown[];
  currentPick?: object;
}

export class PickerModal extends PureComponent<PickerModalProps> {
  static defaultProps = {
    visible: false,
    onCancelPress: null,
    onDonePress: null,
    data: [],
    currentPick: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPick: props.currentPick,
    };
  }

  handlePicker = (currentPick) => {
    this.setState({ currentPick });
  }

  handleOnDonePress = () => {
    this.props.onDonePress(this.state.currentPick);
  }

  render() {
    const {
      visible,
      onCancelPress,
      data,
    } = this.props;

    return (
      <Modal
        animationType="slide"
        visible={visible}
        transparent={false}
        onRequestClose={onCancelPress}
      >
        <ModalHeader
          title="Select a feed"
          leftButtonTitle="Cancel"
          leftButtonAction={onCancelPress}
          rightButtonTitle="Done"
          rightButtonAction={this.handleOnDonePress}
        />
        <ModalMain>
          <FlatList
            data={data}
            ItemSeparatorComponent={() => <PickerRowSeparator />}
            renderItem={({ item }) => (
              <PickerRow
                title={item.title}
                description={item.description}
                isPicked={item.key === this.state.currentPick.key}
                onPress={() => this.handlePicker(item)}
              />
            )}
          />
        </ModalMain>
      </Modal>
    );
  }
}
