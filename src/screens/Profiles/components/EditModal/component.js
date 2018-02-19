import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Modal, FlatList, Image, TouchableOpacity, ImageEditor, ImageStore } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { ModalHeader } from 'kitsu/screens/Feed/components/ModalHeader';
import { InfoRow } from 'kitsu/screens/Profiles/components/InfoRow';
import { Input } from 'kitsu/components/Input';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { StyledText } from 'kitsu/components/StyledText';
import { MediaSelectionGrid } from 'kitsu/components/MediaUploader';
import { defaultAvatar, defaultCover } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { cloneDeep } from 'lodash';
import capitalize from 'lodash/capitalize';
import { styles } from './styles';

export class EditModal extends Component {
  static defaultProps = {
    user: null,
    visible: false,
    onCancel: null,
    onConfirm: null
  }

  state = {
    changeset: {},
    changes: {},
    selectedImage: [],
    mediaContext: null,
    hasMadeChanges: false,
    isEditingGender: false,
    isMediaSelectionShown: false
  }

  // This should fire each time the Modal is opened & closed.
  componentWillReceiveProps() {
    this.setState({
      changeset: cloneDeep(this.props.user),
      changes: {},
      hasMadeChanges: false,
      isEditingGender: false
    });
  }

  onCancel() {
    this.props.onCancel();
  }

  onConfirm() {
    this.props.onConfirm(this.state.changes);
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

  handleMediaSelect() {
    const { selectedImage, mediaContext } = this.state;

    // Convert the selected image to a dataURI
    const [image] = selectedImage;
    const cropObj = {
      offset: { x: 0, y: 0 },
      size: { width: image.width, height: image.height }
    };
    // @Perf: This might be slow? Should benchmark this against a native library.
    ImageEditor.cropImage(image.uri, cropObj, (uri) => {
      ImageStore.getBase64ForTag(uri, (data) => {
        this.updateChanges(mediaContext, `data:image/png;base64,${data}`);
      }, (err) => console.log('error converting image to base64:', err));
    }, (err) => console.log('error cropping media:', err));

    // Cleanup
    this.setState({ mediaContext: null, selectedImage: [], isMediaSelectionShown: false });
  }

  handleMediaClose = () => (
    this.setState({ isMediaSelectionShown: false, selectedImage: [], mediaContext: null })
  )

  renderCoverComponent = () => {
    const { changeset, changes } = this.state;
    let cover = { uri: (changeset.coverImage && changeset.coverImage.large) || defaultCover };
    if ('coverImage' in changes) {
      cover = { uri: changes.coverImage };
    }
    return (
      <View style={styles.profileCoverWrapper}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => this.setState({ isMediaSelectionShown: true, mediaContext: 'coverImage' })}>
          <Image
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
        <TouchableOpacity activeOpacity={0.6} onPress={() => this.setState({ isMediaSelectionShown: true, mediaContext: 'avatar' })}>
          <Image
            style={styles.profileImage}
            source={avatar}
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
            selectTextOnFocus={true}
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
    />
  )

  render() {
    const { hasMadeChanges, isMediaSelectionShown } = this.state;
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
              ItemSeparatorComponent={() => (
                <View style={{ height: 10, backgroundColor: colors.darkPurple }} />
              )}
            />

            {/* Media Modal */}
            <Modal
              animationType="slide"
              visible={isMediaSelectionShown}
              transparent={false}
              onRequestClose={() => this.handleMediaClose()}
            >
              <ModalHeader
                title="Select Media"
                leftButtonTitle="Cancel"
                leftButtonAction={() => this.handleMediaClose()}
                rightButtonTitle="Done"
                rightButtonAction={() => this.handleMediaSelect()}
              />
              <View style={{ flex: 1 }}>
                <MediaSelectionGrid
                  filterContext="All"
                  onSelectedImagesChanged={selectedImage => this.setState({ selectedImage })}
                  multiple={false}
                />
              </View>
            </Modal>
          </View>
        </Modal>
      </View>
    )
  }
}
