import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Button, Container, Content, Icon } from 'native-base';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { Col, Grid } from 'react-native-easy-grid';

import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card/Card';
import CardStatus from '../../components/Card/CardStatus';
import CardFull from '../../components/Card/CardFull';
import CardTabs from '../../components/Card/CardTabs';
import CardActivity from '../../components/Card/CardActivity';
import ProgressiveImage from '../../components/ProgressiveImage';
import * as colors from '../../constants/colors';
import ResultsList from '../../screens/Search/Lists/ResultsList';

class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => (
      <Icon ios="ios-body" android="md-body" style={{ fontSize: 20, color: tintColor }} />
    ),
    header: null,
    headerStyle: {
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: 100,
      top: 0,
      left: 0,
      right: 0,
    },
    headerRight: (
      <Button
        style={{
          height: 20,
          width: 83,
          backgroundColor: '#16A085',
          justifyContent: 'center',
          marginRight: 10,
        }}
        small
        success
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: 'white', fontSize: 10 }}>Follow</Text>
      </Button>
    ),
  });

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
    const { profile, navigation, loading } = this.props;
    return (
      <Container style={styles.container}>
        <CustomHeader navigation={navigation} headerImage={images} leftText={'Rob'} />
        <Content style={{ width: Dimensions.get('window').width, marginTop: 65 }}>
          <View
            style={{
              backgroundColor: '#F7F7F7',
              marginTop: 80,
              margin: 10,
              marginBottom: 0,
              borderRadius: 5,
            }}
          >
            <Card leftText="Library" rightText="Reactions">
              <Image
                style={{
                  width: 80,
                  height: 80,
                  marginTop: -50,
                  alignSelf: 'center',
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: 'white',
                }}
                resizeMode="center"
                source={images2}
              />
              <View
                style={{
                  paddingTop: 5,
                  marginLeft: 15,
                  marginRight: 15,
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: '#EEEEEE',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#525252', fontFamily: 'OpenSans', fontSize: 12 }}>
                  VP, VIZ | Sr. Advisor, Kitsu | Founder, Henshin
                </Text>
              </View>
              <View style={{ marginTop: 15 }}>
                {about.map(item => (
                  <View
                    key={item.label}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 2,
                      paddingBottom: 5,
                    }}
                  >
                    <View style={{ width: 25, alignItems: 'center' }}>
                      <IconAwe
                        name={item.icon}
                        style={{
                          fontSize: 11,
                          paddingRight: 10,
                          paddingLeft: 5,
                          alignItems: 'center',
                          color: '#898989',
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        color: '#3A3A3A',
                        fontFamily: 'Open Sans',
                        fontSize: 11,
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
            <CardStatus leftText="Write Post" rightText="Share Photo" />
          </View>
          <View style={{ backgroundColor: '#F7F7F7', borderRadius: 5 }}>
            <CardFull
              single
              singleText="View Library"
              heading="Recent Activity"
            >
              {this.renderImageRow(
                [
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    caption: 'Watched ep 1.',
                    key: 1,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    caption: 'Watched ep 1.',
                    key: 2,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    caption: 'Watched ep 1.',
                    key: 3,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    caption: 'Watched ep 1.',
                    key: 4,
                  },
                ],
                110,
                true,
              )}
            </CardFull>
            <CardFull
              single
              singleText="View All Favorites"
              heading="Favorite Characters"
              onPress={() =>
                this.props.navigation.navigate('FavoriteCharacters', {
                  label: 'Favorite Characters',
                })}
            >
              {this.renderImageRow(
                [
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    caption: 'Watched ep 1.',
                    key: 1,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    caption: 'Watched ep 1.',
                    key: 1,
                  },
                ],
                (Dimensions.get('window').width - 24) / 2,
              )}
              {this.renderImageRow(
                [
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    caption: 'Watched ep 1.',
                    key: 1,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    caption: 'Watched ep 1.',
                    key: 2,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    caption: 'Watched ep 1.',
                    key: 2,
                  },
                ],
                110,
              )}
            </CardFull>
            <CardTabs
              single
              singleText="View All Favorites"
              heading="Favorite Anime"
              onPress={() =>
                this.props.navigation.navigate('FavoriteMedia', { label: 'Favorite Media' })}
            >
              <Grid tabLabel="Favorite Anime">
                <Col size={45}>
                  <ProgressiveImage
                    source={{ uri: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg' }}
                    containerStyle={{
                      height: 250,
                      backgroundColor: colors.imageGrey,
                    }}
                    style={{ height: 250 }}
                  />
                </Col>
                <Col size={55}>
                  <View style={{ marginTop: -2, marginLeft: 4 }}>
                    <ResultsList
                      dataArray={Array(4).fill(1).map((item, index) => ({ key: index }))}
                      numColumns={2}
                      imageSize={{
                        h: 127,
                        w: Dimensions.get('window').width / 3,
                        m: 2,
                      }}
                      refreshing={undefined}
                      onRefresh={undefined}
                    />
                  </View>
                </Col>
              </Grid>
              <Grid tabLabel="Favorite Manga">
                <Col size={45}>
                  <ProgressiveImage
                    source={{ uri: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg' }}
                    containerStyle={{
                      height: 250,
                      backgroundColor: colors.imageGrey,
                    }}
                    style={{ height: 250 }}
                  />
                </Col>
                <Col size={55}>
                  <View style={{ marginTop: -2, marginLeft: 4 }}>
                    <ResultsList
                      dataArray={Array(4).fill(1).map((item, index) => ({ key: index }))}
                      numColumns={2}
                      imageSize={{
                        h: 127,
                        w: Dimensions.get('window').width / 3,
                        m: 2,
                      }}
                      refreshing={undefined}
                      onRefresh={undefined}
                    />
                  </View>
                </Col>
              </Grid>
            </CardTabs>
            <Text
              style={{
                color: '#A8A8A8',
                fontWeight: '500',
                fontSize: 12,
                padding: 10,
                paddingBottom: 5,
                paddingTop: 15,
              }}
            >
              ACTIVITY
            </Text>
            <FlatList
              data={[
                {
                  liked: true,
                  data: { type: 'text' },
                  key: 1,
                },
                {
                  liked: true,
                  data: { type: 'text' },
                  key: 3,
                },
                {
                  liked: false,
                  data: {
                    type: 'video',
                    image: 'http://static.zerochan.net/Fullmetal.Alchemist.Brotherhood.full.1907775.jpg',
                  },
                  key: 2,
                },
                {
                  liked: false,
                  data: {
                    type: 'video',
                    image: 'http://static.zerochan.net/Fullmetal.Alchemist.Brotherhood.full.1907775.jpg',
                  },
                  key: 4,
                },
                {
                  liked: false,
                  data: {
                    type: 'video',
                    image: 'http://static.zerochan.net/Fullmetal.Alchemist.Brotherhood.full.1907775.jpg',
                  },
                  key: 5,
                },
              ]}
              renderItem={({ item }) => <CardActivity {...item} />}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { loading, profile } = user;
  return { loading, profile };
};

const styles = {
  container: {
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

ProfileScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const images = require('../../assets/img/posters/naruto2.jpg');
const images2 = require('../../assets/img/posters/fullmetal.jpg');

const about = [
  { label: 'Waifu is Pikachu', icon: 'heart' },
  { label: 'Gender is Male', icon: 'venus-mars' },
  { label: 'Lives in 異世界', icon: 'map-marker' },
  { label: 'Birthday is January 2nd', icon: 'birthday-cake' },
  { label: 'Joined 3 years ago', icon: 'calendar' },
  { label: 'Followed by 79 people, following 24 people', icon: 'user' },
];

export default connect(mapStateToProps)(ProfileScreen);
