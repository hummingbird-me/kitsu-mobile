import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { View, FlatList, Text } from 'react-native';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { getImgixCoverImage } from 'kitsu/utils/imgix';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { defaultCover, defaultAvatar } from 'kitsu/constants/app';
import { Kitsu } from 'kitsu/config/api';
import { styles } from './styles';

class Following extends PureComponent {
  static propTypes = {
    userId: PropTypes.number.isRequired,
  }

  state = {
    loading: true,
    data: null,
  }

  componentDidMount = async () => {
    try {
      const following = await Kitsu.findAll('follows', {
        fields: {
          users: 'avatar,coverImage,name,slug',
        },
        filter: {
          follower: this.props.userId,
        },
        include: 'followed',
        sort: '-created_at',
      });

      this.setState({
        following,
        loading: false,
      });
    } catch (err) {
      console.log('Unhandled error while retrieving groups: ', err);
    }
  }

  renderGroupItem = ({ item }) => {
    if (!item || !item.followed) return null;
    const { avatar, coverImage, name } = item.followed;
    return (
      <View style={styles.userContainer}>
        <ProgressiveImage
          hasOverlay
          style={styles.headerCoverImage}
          source={{ uri: (coverImage && getImgixCoverImage(coverImage)) || defaultCover }}
        />
        <View style={styles.userProfileContainer}>
          <FastImage
            style={styles.userProfileImage}
            source={{ uri: (avatar && avatar.medium) || defaultAvatar }}
            cache="web"
          />
          <View style={styles.userProfileTextWrapper}>
            <Text style={styles.userProfileName}>{name}</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { following, loading } = this.state;

    if (loading) {
      return <SceneLoader />;
    }

    return (
      <TabContainer>
        <FlatList
          listKey="groups"
          data={following}
          renderItem={this.renderGroupItem}
          ItemSeparatorComponent={() => <RowSeparator />}
        />
      </TabContainer>
    );
  }
}

export const component = Following;
