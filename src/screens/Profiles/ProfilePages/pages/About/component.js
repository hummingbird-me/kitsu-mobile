import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FlatList, View } from 'react-native';

import { Kitsu } from 'kitsu/config/api';
import { InfoRow } from 'kitsu/screens/Profiles/components/InfoRow';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import { styles } from './styles';

const ItemSeparator = () => <View style={{ height: 10 }} />;

class About extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
  };

  state = {
    loading: true,
    data: null,
  }

  componentDidMount = async () => {
    const { userId } = this.props;
    try {
      const data = await Kitsu.one('users', userId).get({
        include: 'profileLinks.profileLinkSite,favorites.item',
      });

      this.setState({
        data,
        loading: false,
      });
    } catch (err) {
      console.log('Unhandled error while retrieving user data: ', err);
    }
  }


  render() {
    const { loading, data } = this.state;
    console.log('==> PROFILE', data);

    if (loading) {
      // Return loading state.
      return null;
    }

    const waifuOrHusbandoComponent = (
      <MediaRow
        imageVariant="thumbnail"
        title={profile.waifu.name}
        thumbnail={{ uri: profile.waifu.image && profile.waifu.image.original }}
        summary={profile.waifu.description}
        summaryLines={2}
      />
    );
    const aboutRows = [
      { key: 'waifuOrHusbando', label: profile.waifuOrHusbando, contentComponent: waifuOrHusbandoComponent },
      { key: 'gender', label: 'Gender', content: profile.gender },
      { key: 'location', label: 'Location', content: profile.location },
      { key: 'birthday', label: 'Birthday', content: moment(profile.birthday).format('MMMM Do') },
      { key: 'joinDate', label: 'Join date', content: moment(profile.createdAt).format('MMMM Do, YYYY') },
    ];
    return (
      <SceneContainer>
        <FlatList
          style={{ marginTop: 10 }}
          data={aboutRows}
          renderItem={({ item }) => (
            <InfoRow
              label={item.label}
              content={item.content}
              contentComponent={(item.key === 'waifuOrHusbando' && item.contentComponent) && item.contentComponent}
            />
          )}
          ItemSeparatorComponent={() => <ItemSeparator />}
        />
      </SceneContainer>
    );
  }
}

export const component = About;
