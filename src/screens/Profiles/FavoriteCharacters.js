import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button, Container, Content } from 'native-base';
import AweIcon from 'react-native-vector-icons/FontAwesome';

import ProgressiveImage from '../../components/ProgressiveImage';
import ResultsList from '../../screens/Search/Lists/ResultsList';
import * as colors from '../../constants/colors';

class FavoriteCharacter extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.label,
    headerLeft: (
      <Button transparent color="white" onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" style={{ color: 'white' }} />
      </Button>
    ),
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-body" android="md-body" style={{ fontSize: 24, color: tintColor }} />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      index: 0,
    };
  }

  renderImageRow(data, height = 120, hasCaption) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
        {data.map((item, index) => (
          <View key={index} style={{ flex: 1, paddingRight: index === data.length - 1 ? 0 : 5 }}>
            <ProgressiveImage
              source={{ uri: item.image }}
              containerStyle={{
                height,
                backgroundColor: colors.imageGrey,
              }}
              style={{ height }}
            />
            {hasCaption &&
              <Text
                style={{
                  fontSize: 9,
                  paddingTop: 3,
                  fontFamily: 'OpenSans',
                  textAlign: 'center',
                }}
              >
                {item.caption}
              </Text>}
          </View>
        ))}
      </View>
    );
  }

  render() {
    const data = this.props.results.length > 0
      ? this.props.results
      : Array(20).fill(1).map((item, index) => ({ key: index }));
    return (
      <Container>
        <Content>
          <View style={{ padding: 5, paddingTop: 0 }}>
            <ResultsList
              dataArray={Array(2).fill(1).map((item, index) => ({ key: index }))}
              loadMore={() => console.log('1')}
              refresh={() => console.log('2')}
              numColumns={3}
              imageSize={{
                h: Dimensions.get('window').width / 2,
                w: Dimensions.get('window').width / 2,
              }}
              refreshing={false}
            />
            <ResultsList
              dataArray={Array(21).fill(1).map((item, index) => ({ key: index }))}
              loadMore={() => console.log('1')}
              refresh={() => console.log('2')}
              numColumns={3}
              imageSize={{
                h: Dimensions.get('window').width / 3,
                w: Dimensions.get('window').width / 3,
              }}
              refreshing={false}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

FavoriteCharacter.propTypes = {
  results: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = ({ anime }, ownProps) => {
  const { resultsLoading } = anime;
  const { navigation: { state: { params: { active } } } } = ownProps;

  return { results: [], loading: resultsLoading };
};
export default connect(mapStateToProps)(FavoriteCharacter);
