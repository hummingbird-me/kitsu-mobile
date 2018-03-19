import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Modal, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import { InfoRow } from 'kitsu/screens/Profiles/components/InfoRow';
import { Input } from 'kitsu/components/Input';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { defaultAvatar, defaultCover, originalCoverImageDimensions } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { cloneDeep } from 'lodash';
import capitalize from 'lodash/capitalize';
import ImagePicker from 'react-native-image-crop-picker';
import { styles } from './styles';
import { getImgixCoverImage } from 'kitsu/utils/coverImage';

export class EditModal extends Component {
  static defaultProps = {
    user: null,
    visible: false,
    onCancel: null,
    onConfirm: null,
  }

  state = {
    changeset: {},
    changes: {},
    hasMadeChanges: false,
    isEditingGender: false,
  }

  // This should fire each time the Modal is opened & closed.
  componentWillReceiveProps() {
    this.setState({
      changeset: cloneDeep(this.props.user),
      changes: {},
      hasMadeChanges: false,
      isEditingGender: false,
    });
  }

  onCancel() {
    this.props.onCancel();
  }

  onConfirm() {
    this.props.onConfirm(this.state.changes);
  }

  onMediaSelect = async (mediaContext, width, height) => {
    try {
      const image = await ImagePicker.openPicker({
        width,
        height,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
        cropperCircleOverlay: mediaContext === 'avatar',
      });
      console.log(image);
      this.updateChanges(mediaContext, `data:${image.mime};base64,${image.data}`);
    } catch (e) {
      console.log(e);
    }
  }

  updateChanges(property, value) {
    const { changes, changeset } = this.state;
    changeset[property] = value;
    changes[property] = value;
    this.setState({ changes, changeset, hasMadeChanges: true });
  }

  handleGenderChange(option) {
    const cmd = option.toLowerCase();
    switch (cmd) {
      case 'male':
      case 'female':
        this.updateChanges('gender', cmd);
        break;
      case 'custom':
        this.setState({ isEditingGender: true });
        break;
      default: // it's a secret
        this.updateChanges('gender', null);
        break;
    }
  }

  renderCoverComponent = () => {
    const { changeset, changes } = this.state;

    // Use the imgix cover here otherwise if we use original
    // we may run into the problem where a users original cover is too large
    // and it causes a crash on android :(
    let cover = { uri: getImgixCoverImage(changeset.coverImage) || defaultCover };
    if ('coverImage' in changes) {
      cover = { uri: changes.coverImage };
    }

    return (
      <View style={styles.profileCoverWrapper}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            this.onMediaSelect('coverImage', originalCoverImageDimensions.width, originalCoverImageDimensions.height)
          }
        >
          <FastImage
            style={styles.profileCover}
            source={cover}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderAvatarComponent = () => {
    const { changeset, changes } = this.state;
    let avatar = { uri: (changeset.avatar && changeset.avatar.medium) || defaultAvatar };
    if ('avatar' in changes) {
      avatar = { uri: changes.avatar };
    }
    return (
      <View style={styles.profileImageWrapper}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => this.onMediaSelect('avatar', 300, 300)}>
          <FastImage
            style={styles.profileImage}
            source={avatar}
            borderRadius={40}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderLocationComponent = () => (
    <Input
      placeholder="Location"
      value={this.state.changeset.location}
      onChangeText={text => this.updateChanges('location', text)}
    />
  )

  renderGenderComponent = () => {
    const options = ['It\'s a secret', 'Male', 'Female', 'Custom', 'Nevermind'];
    const gender = this.state.isEditingGender ? this.state.gender :
      (this.state.changeset.gender && capitalize(this.state.changeset.gender) || 'It\'s a secret');
    return (
      <SelectMenu
        options={options}
        onOptionSelected={(option) => this.handleGenderChange(option)}>
        <View pointerEvents={this.state.isEditingGender ? 'auto' : 'none'}>
          <Input
            selectTextOnFocus
            value={gender}
            editable={this.state.isEditingGender}
            onChangeText={text => this.updateChanges('gender', text)}
          />
        </View>
      </SelectMenu>
    );
  }

  renderBioComponent = () => (
    <Input
      multiline
      containerStyle={{ height: 140 }}
      placeholder="Tell the world your story."
      value={this.state.changeset.about}
      onChangeText={text => this.updateChanges('about', text)}
      style={{ textAlignVertical: 'top' }}
      maxLength={500}
    />
  )

  render() {
    const { hasMadeChanges } = this.state;
    const { visible, onCancel, onConfirm } = this.props;
    const rows = [
      {
        label: 'Cover',
        component: this.renderCoverComponent(),
      },
      {
        label: 'Avatar',
        component: this.renderAvatarComponent(),
      },
      {
        label: 'Location',
        component: this.renderLocationComponent(),
      },
      {
        label: 'Gender',
        component: this.renderGenderComponent(),
      },
      {
        label: 'Bio',
        component: this.renderBioComponent(),
      },
      // @Todo Needs datepicker code and character search implemented. - vevix
      //{ label: 'Birthday', },
      //{ label: 'Waifu', },
    ];

    return (
      <View>
        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          visible={visible}
          transparent={false}
          onRequestClose={() => this.onCancel()}
        >
          <ModalHeader
            title="Edit Profile"
            leftButtonTitle="Cancel"
            leftButtonAction={() => this.onCancel()}
            rightButtonTitle="Save"
            rightButtonAction={() => this.onConfirm()}
            rightButtonDisabled={!hasMadeChanges}
          />
          <View style={{ flex: 1 }}>
            {/* Profile Components */}
            <KeyboardAwareFlatList
              data={rows}
              renderItem={({ item }) => (
                <InfoRow
                  label={item.label}
                  contentComponent={item.component}
                />
              )}
            />
          </View>
        </Modal>
      </View>
    )
  }
}
