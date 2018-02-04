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
    userId: PropTypes.string.isRequired,
  };

  state = {
    loading: true,
    data: null,
  }

  componentDidMount = async () => {
    const { userId } = this.props;
    try {
      const data = await Kitsu.one('users', userId).get({
        include: 'waifu',
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

    if (loading) return <SceneLoader />;

    const aboutRows = [
      { key: 'gender', label: 'Gender', content: capitalize(data.gender) },
      { key: 'location', label: 'Location', content: data.location },
      { key: 'birthday', label: 'Birthday', content: moment(data.birthday).format('MMMM Do') },
      { key: 'joinDate', label: 'Joined', content: moment(data.createdAt).format('MMMM Do, YYYY') },
    ];

    if (data.waifu) {
      const waifuOrHusbandoComponent = (
        <MediaRow
          imageVariant="thumbnail"
          title={data.waifu.name}
          thumbnail={{ uri: data.waifu.image && data.waifu.image.original }}
          summary={data.waifu.description}
          summaryLines={2}
        />
      );

      aboutRows.unshift({ key: 'waifuOrHusbando', label: data.waifuOrHusbando, contentComponent: waifuOrHusbandoComponent });
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
