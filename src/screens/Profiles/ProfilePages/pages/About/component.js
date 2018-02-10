import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FlatList, View } from 'react-native';
import { Kitsu } from 'kitsu/config/api';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { InfoRow } from 'kitsu/screens/Profiles/components/InfoRow';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import capitalize from 'lodash/capitalize';

const ItemSeparator = () => <View style={{ height: 10 }} />;

class About extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired
  };

  render() {
    const { profile } = this.props;
    const aboutRows = [
      { key: 'gender', label: 'Gender', content: profile.gender ? capitalize(profile.gender) : 'It\'s a secret' },
      { key: 'location', label: 'Location', content: profile.location || 'It\'s a secret' },
      { key: 'birthday', label: 'Birthday', content: moment(profile.birthday).format('MMMM Do') },
      { key: 'joinDate', label: 'Joined', content: moment(profile.createdAt).format('MMMM Do, YYYY') },
    ];

    if (profile.waifu) {
      const waifuOrHusbandoComponent = (
        <MediaRow
          imageVariant="thumbnail"
          title={profile.waifu.name}
          thumbnail={{ uri: profile.waifu.image && profile.waifu.image.original }}
          summary={profile.waifu.description}
          summaryLines={2}
        />
      );
      aboutRows.unshift({ key: 'waifuOrHusbando', label: profile.waifuOrHusbando, contentComponent: waifuOrHusbandoComponent });
    }

    return (
      <TabContainer>
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
      </TabContainer>
    );
  }
}

export const component = About;
