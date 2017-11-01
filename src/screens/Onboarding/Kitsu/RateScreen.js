import React from 'react';
import { View, Text } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Button } from 'kitsu/components/Button';
import { connect } from 'react-redux';
import { fox } from 'kitsu/assets/img/onboarding';
import { styles as commonStyles } from '../common/styles';

class RateScreen extends React.Component {
  state = {
    entries: [
      {
        title: 'test',
        image: fox,
      },
      {
        title: 'test',
        image: fox,
      },
      {
        title: 'test',
        image: fox,
      },
      {
        title: 'test',
        image: fox,
      },
    ],
  };

  renderItem = ({ item }) => (
    <View>
      <Text>{item.title}</Text>
    </View>
  );

  render() {
    return (
      <View style={commonStyles.container}>
        <Carousel
          ref={(c) => {
            this.carousel = c;
          }}
          data={this.state.entries}
          renderItem={this.renderItem}
          sliderWidth={300}
          itemWidth={300}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { loading, error } = user;
  return { loading, error };
};
export default connect(mapStateToProps, null)(RateScreen);
