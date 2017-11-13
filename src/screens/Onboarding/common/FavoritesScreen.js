import React from 'react';
import { View, ScrollView, Text, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { Pill } from 'kitsu/components/Pill';
import { connect } from 'react-redux';
import { Kitsu, setToken } from 'kitsu/config/api';
import { setScreenName, updateFavorites } from 'kitsu/store/onboarding/actions';
import { styles } from './styles';

const COLOR_LIST = ['#d95e40', '#f2992e', '#56bc8a', '#529ecc', '#a77dc2'];
class FavoritesScreen extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    const categories = this.props.favoriteCategories.slice();
    for (let i = 0; i < categories.length; i += 1) {
      const index = i % 5;
      // set colors if pills are not colored yet.
      if (!categories[i].color) {
        categories[i].color = COLOR_LIST[index];
      }
    }
    this.props.updateFavorites(categories);
  }

  onConfirm = () => {
    this.props.setScreenName('RatingSystemScreen');
    this.props.navigation.navigate('RatingSystemScreen');
  };

  onPressPill = async (category, index, isSubCategory) => {
    if (!this.state.loading) {
      let categories = this.props.favoriteCategories.slice();
      categories[index].loading = true;
      this.props.updateFavorites(categories);
      this.prepareAnimation();
      this.setState({ loading: true });
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
                // also remove subpills if they're selected as well.
                // there is no way to unfave them at once.
                // there is also no error checking for this request.
                this.onRemoveFavorite(categories[i].favoritesId, i);
              }
            }
            categories.splice(start, category.subCategoryLength);
          } else {
            let subCategories;
            try {
              // select the category and get subcategories of it
              subCategories = await this.getSubCategories(category.id);
              categories[index].subCategoryLength = subCategories.length;
              for (let i = 0; i < subCategories.length; i += 1) {
                subCategories[i].color = category.color;
                subCategories[i].isSubCategory = true;
              }
              // append subcategories to current array
              categories.splice(index + 1, 0, ...subCategories);
            } catch (e) {
              console.log(e);
            }
          }
        }
        categories[index].selected = !category.selected;
        categories[index].loading = false;

        this.prepareAnimation();
        this.props.updateFavorites(categories);
        this.setState({ loading: false });
      } else {
        categories = this.props.favoriteCategories.slice();
        categories[index].loading = false;
        this.props.updateFavorites(categories);
        this.setState({ loading: false });
        // TODO: handle network errors here.
        console.log('network request failed somehow.');
      }
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
      const categories = this.props.favoriteCategories.slice();
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
        const categories = this.props.favoriteCategories.slice();
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

  prepareAnimation = () => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  render() {
    const { favoriteCategories: categories } = this.props;
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
                  key={v.id}
                  selected={v.selected}
                  onPress={() => this.onPressPill(v, i, v.isSubCategory)}
                  loading={v.loading}
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

const mapStateToProps = ({ onboarding, auth, user }) => ({
  favoriteCategories: onboarding.favoriteCategories,
  accessToken: auth.tokens.access_token,
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, { setScreenName, updateFavorites })(FavoritesScreen);
