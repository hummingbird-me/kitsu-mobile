import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { defaultAvatar } from 'kitsu/constants/app';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { Kitsu } from 'kitsu/config/api';

class Groups extends PureComponent {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    loadingGroups: PropTypes.bool,
    groups: PropTypes.array,
  }

  static defaultProps = {
    loadingGroups: false,
    groups: [],
  }

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
  }

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
