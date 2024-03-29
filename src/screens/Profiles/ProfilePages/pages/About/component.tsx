import capitalize from 'lodash/capitalize';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';

import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Kitsu } from 'kitsu/config/api';
import { InfoRow } from 'kitsu/screens/Profiles/components/InfoRow';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';

interface AboutProps {
  profile: object;
}

class About extends PureComponent<AboutProps> {
  render() {
    const { profile } = this.props;
    const aboutRows = [
      {
        key: 'gender',
        label: 'Gender',
        content: profile.gender ? capitalize(profile.gender) : "It's a secret",
      },
      {
        key: 'location',
        label: 'Location',
        content: profile.location || "It's a secret",
      },
      {
        key: 'birthday',
        label: 'Birthday',
        content: profile.birthday
          ? moment(profile.birthday).format('MMMM Do')
          : "It's a secret",
      },
      {
        key: 'joinDate',
        label: 'Joined',
        content: moment(profile.createdAt).format('MMMM Do, YYYY'),
      },
    ];

    if (profile.waifu) {
      const waifuOrHusbandoComponent = (
        <MediaRow
          imageVariant="thumbnail"
          title={profile.waifu.name}
          thumbnail={{
            uri: profile.waifu.image && profile.waifu.image.original,
          }}
          summary={profile.waifu.description}
          summaryLines={2}
        />
      );
      aboutRows.unshift({
        key: 'waifuOrHusbando',
        label: profile.waifuOrHusbando,
        contentComponent: waifuOrHusbandoComponent,
      });
    }

    return (
      <TabContainer>
        <FlatList
          listKey="about"
          data={aboutRows}
          renderItem={({ item }) => (
            <InfoRow
              label={item.label}
              content={item.content}
              contentComponent={
                item.key === 'waifuOrHusbando' &&
                item.contentComponent &&
                item.contentComponent
              }
            />
          )}
        />
      </TabContainer>
    );
  }
}

export const component = About;
