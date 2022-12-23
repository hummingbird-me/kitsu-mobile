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
  container: {
    paddingBottom: spacing.small,
    overflow: 'visible',
    backgroundColor: 'transparent',
    position: 'relative',
  },

  container__profile: {
    marginTop: cardSize.square.height * (-0.5),
  },
  container__group: {
    marginTop: cardSize.square.height * (-0.5),
  },
  container__media: {
    marginTop: cardSize.portraitLarge.height * (-0.65),
  },

  backgroundView: {
    position: 'absolute',
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  backgroundView__profile: {
    top: cardSize.square.height * 0.5,
  },
  backgroundView__group: {
    top: cardSize.square.height * 0.5,
  },
  backgroundView__media: {
    top: cardSize.portraitLarge.height * 0.65,
  },

  profileHeaderView: {
    flexDirection: 'row',
    paddingHorizontal: scenePadding,
  },

  profileImageViewShadow: {
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
    borderRadius: cardSize.square.width,
  },
  profileImageView__group: {
    width: cardSize.square.width,
    height: cardSize.square.height,
    borderRadius: 6,
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scenePadding,
    marginTop: scenePadding,
  },
  statusView: {
    flexDirection: 'row',
    paddingHorizontal: scenePadding,
    marginTop: scenePadding,
    alignItems: 'center',
  },
  kitsuScore: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: colors.lightestGrey,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kitsuScoreText: {
    margin: 2,
  },
  subStatusView: {
    flexDirection: 'column',
    padding: 4,
    justifyContent: 'center',
  },
  statusItemView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem__rating: {
    marginBottom: 4,
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
