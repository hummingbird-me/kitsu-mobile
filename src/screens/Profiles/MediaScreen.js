import React, { Component } from 'react';
import { View, Text, Image, Dimensions, FlatList, Animated } from 'react-native';
import { connect } from 'react-redux';
import { Button, Container, Content, Icon } from 'native-base';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import CustomHeader from '../../components/CustomHeader';
import DoubleProgress from '../../components/DoubleProgress';
import CardStatus from '../../components/Card/CardStatus';
import CardFull from '../../components/Card/CardFull';
import CardActivity from '../../components/Card/CardActivity';
import ProgressiveImage from '../../components/ProgressiveImage';
import * as colors from '../../constants/colors';

const { width } = Dimensions.get('window');

class MediaScreen extends Component {
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

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.animatedValue = new Animated.Value(0);
  }
  expand() {
    if (this.view) {
      if (this.state.expanded) {
        this.view.transition({ height: 130 }, { height: 70 }, 100, 'ease-in');
      } else {
        this.view.transition({ height: 70 }, { height: 130 }, 100, 'ease-in');
      }
      this.setState({ expanded: !this.state.expanded });
    }
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
    const { profile, navigation, loading } = this.props;
    return (
      <Container style={styles.container}>
        <CustomHeader
          navigation={navigation}
          headerImage={{
            uri: 'https://static1.comicvine.com/uploads/original/11113/111130700/5480313-2167585338-12301.jpg',
          }}
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          right={
            <Button
              style={{
                justifyContent: 'center',
                zIndex: 100,
              }}
              transparent
              onPress={() => navigation.goBack()}
            >
              <IconAwe style={{ color: 'white', fontSize: 18 }} name="ellipsis-h" />
            </Button>
          }
        />
        <Content style={{ width }}>
          <View
            style={{
              marginTop: 120,
              margin: 10,
              borderRadius: 5,
            }}
          >
            <Image
              source={{ uri: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg' }}
              style={{ width: 30, height: 30, borderRadius: 15, marginBottom: 5 }}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 10,
                fontWeight: '600',
                fontFamily: 'OpenSans',
                width: width / 1.70,
              }}
              numberOfLines={3}
            >
              “The most visually interesting, effectively comedic, genuinely heart-felt satire I’ve seen. Wonderful and re-watchable.”
            </Text>
          </View>
          <View style={{ backgroundColor: '#F7F7F7', borderRadius: 0 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 15,
                paddingTop: 5,
              }}
            >
              <View>
                <Text
                  style={{
                    color: '#333333',
                    fontWeight: 'bold',
                    fontSize: 14,
                    fontFamily: 'OpenSans',
                  }}
                >
                  One-Punch Man <Text style={{ color: '#929292', fontSize: 12 }}>2017</Text>
                </Text>
                <Text style={{ color: '#929292', fontSize: 12, marginBottom: 5, marginTop: 3 }}>
                  91% <Text style={{ color: '#575757', fontWeight: 'bold' }}>TV</Text>
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconAwe
                    name="heart"
                    style={{ fontSize: 11, color: '#e74c3c', marginRight: 5 }}
                  />
                  <Text
                    style={{
                      color: '#464646',
                      fontWeight: '500',
                      fontFamily: 'OpenSans',
                      fontSize: 12,
                    }}
                  >
                    Rank #29 (Most Popular)
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconAwe name="star" style={{ fontSize: 11, color: '#f39c12', marginRight: 5 }} />
                  <Text
                    style={{
                      color: '#464646',
                      fontWeight: '500',
                      fontFamily: 'OpenSans',
                      fontSize: 12,
                    }}
                  >
                    Rank #29 (Highest Rated Anime)
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: -100 }}>
                <ProgressiveImage
                  source={{ uri: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg' }}
                  style={{ height: 167, width: 118, borderRadius: 3 }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                padding: 15,
                paddingTop: 0,
                paddingBottom: 5,
                flexWrap: 'wrap',
              }}
            >
              {[
                'Action',
                'Adventure',
                'Contemporary Fantasy',
                'Fantasy',
                'Military',
                'Magic',
                'Fantasy',
              ].map(item => (
                <Button
                  style={{
                    height: 20,
                    borderColor: '#eaeaea',
                    backgroundColor: '#FFFFFF',
                    marginRight: 5,
                    marginBottom: 5,
                  }}
                  bordered
                  light
                >
                  <Text style={{ fontSize: 12, fontFamily: 'OpenSans' }}>{item}</Text>
                </Button>
              ))}
            </View>
            <Animatable.View
              style={{ padding: 15, paddingTop: 0, height: 70, overflow: 'hidden', zIndex: 2 }}
              onPress={() => this.expand()}
              ref={el => (this.view = el)}
            >
              {!this.state.expanded &&
                <LinearGradient
                  colors={['rgba(247,247,247, 0.5)', '#f7f7f7']}
                  locations={[0.4, 1]}
                  onPress={() => this.expand()}
                  style={{ height: 30, width, position: 'absolute', bottom: 0, zIndex: 1 }}
                />}
              <Text
                onPress={() => this.expand()}
                style={{ fontSize: 11, color: '#333333', lineHeight: 15, fontFamily: 'OpenSans' }}
              >
                The seemingly ordinary and unimpressive Saitama has a rather unique hobby: being a hero. In order to pursue his childhood dream, he trained relentlessly for three years—and lost all of his hair in the process. Now, Saitama is incredibly powerful, so much so that no enemy is able to defeat him in battle. In fact, all it takes to defeat evildoers with just one punch has led to an unexpected problem—he is no longer able to enjoy the thrill of battling and has become quite bored
              </Text>
            </Animatable.View>
            <CardFull single heading="Theme / Plot">
              <DoubleProgress left="SLOW" right="FAST" leftProgress={0.3} rightProgress={0} />
              <DoubleProgress left="SIMPLE" right="COMPLEX" leftProgress={0} rightProgress={0.8} />
              <DoubleProgress left="LIGHT" right="DARK" leftProgress={0.3} rightProgress={0} />
              <View
                style={{
                  height: '100%',
                  position: 'absolute',
                  borderLeftWidth: 1,
                  top: 10,
                  alignSelf: 'center',
                  borderColor: '#C0C0C0',
                }}
              />
            </CardFull>
            <View style={{ margin: 10 }}>
              <Text style={{ color: '#969696', fontSize: 10, marginLeft: 5 }}>EPISODES · 12</Text>
              <View style={{ flexDirection: 'row' }}>
                {['Episode 1', 'Episode 2', 'Episode 3'].map(item => (
                  <View style={{ margin: 5 }}>
                    <ProgressiveImage
                      source={{ uri: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg' }}
                      style={{ height: 83, width: 148, borderRadius: 5 }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        padding: 5,
                        bottom: 0,
                        backgroundColor: 'transparent',
                      }}
                    >
                      <Text
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: 12,
                          fontFamily: 'OpenSans',
                        }}
                      >
                        Episode 1
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 10,
                          fontFamily: 'OpenSans',
                        }}
                      >
                        The Strongest Man
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <CardFull
              single
              singleText="View All"
              heading="More from this series"
            >
              {this.renderImageRow(
                [
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    key: 1,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    key: 2,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    key: 3,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    key: 4,
                  },
                ],
                110,
                false,
              )}
            </CardFull>
            <CardFull single singleText="View All" heading="Characters">
              {this.renderImageRow(
                [
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    key: 1,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    key: 2,
                  },
                  {
                    image: 'https://i.ytimg.com/vi/C0_EkYWJGEw/maxresdefault.jpg',
                    key: 3,
                  },
                ],
                115,
              )}
            </CardFull>
            <CardStatus leftText="Write Post" rightText="Share Photo" style={{ margin: 10 }} />
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

MediaScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(MediaScreen);
