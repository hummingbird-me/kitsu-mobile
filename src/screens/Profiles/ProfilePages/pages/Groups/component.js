import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defaultAvatar } from 'kitsu/constants/app';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { Kitsu } from 'kitsu/config/api';

class Groups extends PureComponent {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
  }

  state = {
    loading: true,
    data: null,
  }

  componentDidMount = async () => {
    const { userId } = this.props;
    try {
      const data = await Kitsu.findAll('group-members', {
        fields: {
          group: 'slug,name,avatar,tagline,membersCount,category',
        },
        filter: {
          query_user: userId,
        },
        include: 'group.category',
        sort: '-created_at',
      });

      this.setState({
        data,
        loading: false,
      });
    } catch (err) {
      console.log('Unhandled error while retrieving groups: ', err);
    }
  }

  render() {
    const { loading, data } = this.state;

    if (loading) {
      // Return loading state.
      return null;
    }

    return (
      <TabContainer>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <MediaRow
              imageVariant="thumbnail"
              title={item.group.name}
              summary={item.group.about}
              thumbnail={{
                uri: item.group.avatar.large ? item.group.avatar.large : defaultAvatar,
              }}
              summaryLines={2}
            />
          )}
          ItemSeparatorComponent={() => <RowSeparator />}
        />
      </TabContainer>
    );
  }
}


const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const component = connect(mapStateToProps)(Groups);
