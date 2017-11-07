import React from 'react';
import { View, ScrollView, Text, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { Pill } from 'kitsu/components/Pill';
import { connect } from 'react-redux';
import { Kitsu, setToken } from 'kitsu/config/api';
import { styles } from './styles';

const COLOR_LIST = ['#d95e40', '#f2992e', '#56bc8a', '#529ecc', '#a77dc2'];
class FavoritesScreen extends React.Component {
  state = {
    categories: [
      {
        title: 'Action',
        selected: false,
        subCategoryLength: 0,
        id: 150,
      },
      {
        title: 'Adventure',
        selected: false,
        subCategoryLength: 0,
        id: 157,
      },
      {
        title: 'Comedy',
        selected: false,
        subCategoryLength: 0,
        id: 160,
      },
      // {
      //   title: 'Ecchi',
      //   selected: false,
      //   subCategoryLength: 0,
      // },
      {
        title: 'Fantasy',
        selected: false,
        subCategoryLength: 0,
        id: 156,
      },
      {
        title: 'Harem',
        selected: false,
        subCategoryLength: 0,
        id: 165,
      },
      {
        title: 'Psychological',
        selected: false,
        subCategoryLength: 0,
        id: 232,
      },
      {
        title: 'Romance',
        selected: false,
        subCategoryLength: 0,
        id: 164,
      },
      {
        title: 'Science Fiction',
        selected: false,
        subCategoryLength: 0,
        id: 155,
      },
      {
        title: 'Super Power',
        selected: false,
        subCategoryLength: 0,
        id: 47,
      },
      {
        title: 'Fantasy World',
        selected: false,
        subCategoryLength: 0,
        id: 52,
      },
      {
        title: 'Paralel Universe',
        selected: false,
        subCategoryLength: 0,
        id: 147,
      },
      {
        title: 'Past',
        selected: false,
        subCategoryLength: 0,
        id: 49,
      },
      {
        title: 'Coming of Age',
        selected: false,
        subCategoryLength: 0,
        id: 185,
      },
      {
        title: 'Crime',
        selected: false,
        subCategoryLength: 0,
        id: 175,
      },
      {
        title: 'Cooking',
        selected: false,
        subCategoryLength: 0,
        id: 18,
      },
      {
        title: 'Daily Life',
        selected: false,
        subCategoryLength: 0,
        id: 169,
      },
      {
        title: 'Disaster',
        selected: false,
        subCategoryLength: 0,
        id: 176,
      },
      {
        title: 'Friendship',
        selected: false,
        subCategoryLength: 0,
        id: 167,
      },
      {
        title: 'Law and Order',
        selected: false,
        subCategoryLength: 0,
        id: 183,
      },
      {
        title: 'Military',
        selected: false,
        subCategoryLength: 0,
        id: 207,
      },
      {
        title: 'Politics',
        selected: false,
        subCategoryLength: 0,
        id: 171,
      },
      {
        title: 'School Life',
        selected: false,
        subCategoryLength: 0,
        id: 172,
      },
      {
        title: 'Sports',
        selected: false,
        subCategoryLength: 0,
        id: 180,
      },
      {
        title: 'Revenge',
        selected: false,
        subCategoryLength: 0,
        id: 178,
      },
      {
        title: 'Magical Girl',
        selected: false,
        subCategoryLength: 0,
        id: 37,
      },
    ],
  };

  componentDidMount() {
    const categories = this.state.categories.slice();
    for (let i = 0; i < categories.length; i += 1) {
      const index = i % 5;
      categories[i].color = COLOR_LIST[index];
    }
    this.setState({ categories });
  }

  onConfirm = () => {
    this.props.navigation.navigate('RatingSystemScreen', {
      account: this.props.navigation.state.params.account,
    });
  };

  onPressPill = async (category, index, isSubCategory) => {
    let categories = null;
    if (category.selected) {
      categories = await this.onRemoveFavorite(category.favoritesId, index);
    } else {
      categories = await this.onFaveCategory(category.id, index);
    }
    if (categories) {
      if (!isSubCategory) {
        if (category.selected) {
          const start = index + 1;
          for (let i = start; i < start + category.subCategoryLength; i += 1) {
            if (categories[i].favoritesId) {
              this.onRemoveFavorite(categories[i].favoritesId, i);
            }
          }
          categories.splice(start, category.subCategoryLength);
        } else {
          let subCategories;
          try {
            subCategories = await this.getSubCategories(category.id);
            categories[index].subCategoryLength = subCategories.length;
            for (let i = 0; i < subCategories.length; i += 1) {
              subCategories[i].color = category.color;
              subCategories[i].isSubCategory = true;
            }
            categories.splice(index + 1, 0, ...subCategories);
          } catch (e) {
            console.log(e);
          }
        }
      }
      categories[index].selected = !category.selected;

      if (Platform.OS === 'android') {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ categories });
    }
  };

  onFaveCategory = async (id, index) => {
    const { id: userId } = this.props.currentUser;
    try {
      const res = await Kitsu.create('categoryFavorites', {
        category: {
          id,
        },
        user: {
          id: userId,
        },
      });
      const categories = this.state.categories.slice();
      categories[index].favoritesId = res.id;
      return categories;
    } catch (e) {
      console.log(e);
    }
    return null;
  };

  onRemoveFavorite = async (id, index) => {
    if (id) {
      setToken(this.props.accessToken);
      try {
        await Kitsu.destroy('categoryFavorites', id);
        const categories = this.state.categories.slice();
        categories[index].favoritesId = null;
        return categories;
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('id doesnt exist', id, index);
    }
    return null;
  };

  getSubCategories = async (parentId) => {
    const token = this.props.accessToken;
    setToken(token);
    try {
      const categories = await Kitsu.findAll('categories', {
        fields: {
          categories: 'id,title',
        },
        filter: {
          parent_id: parentId,
        },
      });
      return categories;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  render() {
    const { categories } = this.state;
    const buttonDisabled = categories.filter(v => v.selected).length < 5;
    const buttonTitle = buttonDisabled ? 'Pick at least 5' : 'Looks good!';
    return (
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={styles.tutorialText}>
            Tap categories you like, we’ll use these to help you find new anime and manga.
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View style={styles.pillsWrapper}>
              {categories.map((v, i) => (
                <Pill
                  key={`${v.title + i}`}
                  selected={v.selected}
                  onPress={() => this.onPressPill(v, i, v.isSubCategory)}
                  color={v.color}
                  title={v.title}
                />
              ))}
            </View>
            <Button
              disabled={buttonDisabled}
              style={{ marginHorizontal: 0, marginTop: 36 }}
              onPress={this.onConfirm}
              title={buttonTitle}
              titleStyle={styles.buttonTitleStyle}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, user }) => ({
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, {})(FavoritesScreen);
