import { Dimensions, StyleSheet } from 'react-native';

import * as colors from 'kitsu/constants/colors';

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    alignItems: 'center',
    marginBottom: 70,
    minHeight: Dimensions.get('window').height - 150,
    width: Dimensions.get('window').width * 0.85,
  },
  shadow: {
    // Android
    elevation: 2,

    // iOS
    shadowColor: 'black',
    shadowRadius: 3,
    shadowOpacity: 0.4,
    shadowOffset: {
      height: 2,
    },
  },
  posterImageWrapper: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: 180,
    borderRadius: 10,

    zIndex: 4,
  },
  posterImage: {
    flexGrow: 1,
    resizeMode: 'cover',
    borderRadius: 10,
    justifyContent: 'flex-end',
    padding: 10,
  },
  posterImageGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  episodeRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  currentEpisodeText: {
    backgroundColor: 'transparent',
    color: colors.white,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    fontSize: 12,
  },
  totalEpisodesText: {
    backgroundColor: 'transparent',
    color: colors.white,
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  episodeName: {
    backgroundColor: 'transparent',
    color: colors.white,
    fontFamily: 'OpenSans',
    fontWeight: '700',
    fontSize: 16,
  },
  cardWrapper: {
    position: 'absolute',
    backgroundColor: colors.white,
    top: 80,
    left: 0,
    right: 0,
    bottom: 30,
    borderRadius: 10,
    overflow: 'hidden',

    zIndex: 3,
  },
  cardContent: {
    marginTop: 100,
  },
  cardHeaderArea: {
    backgroundColor: 'rgb(250, 250, 250)',
    borderBottomWidth: 1,
    borderColor: 'rgb(236, 236, 236)',
  },
  progressBar: {
    marginHorizontal: 12,
    marginVertical: 10,
  },
  seriesDescriptionRow: {
    flexDirection: 'row',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  descriptionRow: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 10,
  },
  seriesTitle: {
    fontFamily: 'OpenSans',
    fontWeight: '700',
    marginRight: 5,
  },
  seriesExtraInfo: {
    fontFamily: 'OpenSans',
    color: colors.lightGrey,
  },
  placeholderWrapper: {
    flex: 1,
  },
  placeholder: {
    color: colors.lightGrey,
    flex: 1,
    fontSize: 12,
    fontFamily: 'OpenSans',
    margin: 10,
  },
  updateText: {
    color: 'black',
    flex: 1,
    fontSize: 12,
    fontFamily: 'OpenSans',
    margin: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 14,
    marginHorizontal: 5,
  },
  button: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  discussionButton: {
    flex: 3,
    backgroundColor: colors.lightGrey,
  },
  markWatchedButton: {
    flex: 5,
    backgroundColor: colors.lightGreen,
  },
  loadingSpinner: {
    flexGrow: 1,
  },
});

export default styles;
