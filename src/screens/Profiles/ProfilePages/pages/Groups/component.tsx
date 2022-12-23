import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';

import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';

interface GroupsProps {
  userId: number;
  loadingGroups?: boolean;
  groups?: unknown[];
}

class Groups extends PureComponent<GroupsProps> {
  static defaultProps = {
    loadingGroups: false,
    groups: [],
  };

  renderGroupItem = ({ item }) => {
    if (!item || !item.group) return null;
    return (
      <MediaRow
        imageVariant="thumbnail"
        title={item.group.name}
        summary={item.group.about}
        thumbnail={{
          uri: (item.group.avatar && item.group.avatar.large) || defaultAvatar,
        }}
        summaryLines={2}
      />
    );
  };

  render() {
    const { loadingGroups, groups } = this.props;

    if (loadingGroups) {
      return <SceneLoader />;
    }

    return (
      <TabContainer>
        <FlatList
          listKey="groups"
          data={groups}
          renderItem={this.renderGroupItem}
          ItemSeparatorComponent={() => <RowSeparator />}
        />
      </TabContainer>
    );
  }
}

export const component = Groups;
