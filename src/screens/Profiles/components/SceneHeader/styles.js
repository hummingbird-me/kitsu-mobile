import { StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import {
  scenePadding,
  cardSize,
  coverImageHeight,
  borderWidth,
  spacing,
} from 'kitsu/screens/Profiles/constants';

export const styles = StyleSheet.create({
  wrap: {
    marginTop: -20, // to cover the status bar in iOS
    backgroundColor: '#FFFFFF',
    paddingBottom: spacing.small,
  },
  coverImageView: {
    width: '100%',
    height: coverImageHeight,
  },

  profileHeaderView: {
    flexDirection: 'row',
    paddingHorizontal: scenePadding,
  },
  profileHeaderView__media: {
    marginTop: cardSize.portraitLarge.height * (-0.65),
  },
  profileHeaderView__profile: {
    marginTop: cardSize.square.height * (-0.5),
  },
  profileHeaderView__group: {
    marginTop: cardSize.square.height * (-0.5),
  },

  profileImageViewShadow: {
    borderRadius: 6,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 1,
  },
  profileImageViewShadow__media: {
    borderRadius: 6,
  },
  profileImageViewShadow__profile: {
    borderRadius: cardSize.square.width,
  },
  profileImageViewShadow__group: {
    borderRadius: cardSize.square.width,
  },


  profileImageView: {
    borderWidth: 4 * borderWidth.hairline,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  profileImageView__media: {
    width: cardSize.portraitLarge.width,
    height: cardSize.portraitLarge.height,
    borderRadius: 6,
  },
  profileImageView__profile: {
    width: cardSize.square.width,
    height: cardSize.square.height,
    borderRadius: 6,
  },
  profileImageView__group: {
    width: cardSize.square.width,
    height: cardSize.square.height,
    borderRadius: cardSize.square.width,
  },


  titleView: {
    flex: 1,
    marginLeft: scenePadding,
    position: 'relative',
  },
  titleView__media: {
    height: cardSize.portraitLarge.height,
  },
  titleView__profile: {
    height: cardSize.square.height,
  },
  titleView__group: {
    height: cardSize.square.height,
  },

  titleTop: {
    justifyContent: 'flex-end',
    paddingBottom: scenePadding,
  },
  titleTop__media: {
    height: '65%',
  },
  titleTop__profile: {
    height: '50%',
  },
  titleTop__group: {
    height: '50%',
  },

  titleBottom: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleBottom__media: {
    height: '35%',
  },
  titleBottom__profile: {
    height: '50%',
  },
  titleBottom__group: {
    height: '50%',
  },

  mainButtonView: {
    flex: 3,
  },
  moreButton: {
    flex: 1,
  },
  mainButton: {
    height: 35,
    marginLeft: 0,
    marginRight: 0,
  },
  moreIcon: {
    paddingLeft: scenePadding * 2,
    color: colors.grey,
    fontSize: 28,
  },

  descriptionView: {
    paddingHorizontal: scenePadding,
    marginTop: scenePadding,
  },
  statusView: {
    flexDirection: 'row',
    paddingHorizontal: scenePadding,
    marginTop: scenePadding,
  },
  statusItemView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItemView__rating: {
    marginLeft: 10,
  },
  statusIcon: {
    fontSize: 17,
    marginRight: 5,
  },
  statusIcon__rating: {
    color: colors.yellow,
  },
  statusIcon__popularity: {
    color: colors.red,
  },
  followStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followStatus__followers: {
    marginLeft: 10,
  },
  followStatus__following: {
    marginLeft: 0,
  },

  categories: {
    marginTop: scenePadding,
  },
  categoriesInner: {
    paddingLeft: scenePadding,
    marginLeft: -5,
  },
});
