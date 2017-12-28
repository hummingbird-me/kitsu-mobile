import { Dimensions, StyleSheet } from 'react-native';

import * as colors from 'kitsu/constants/colors';

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    alignItems: 'center',
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
    padding: 4,
  },
  posterImageGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
    backgroundColor: colors.white,
    top: 80,
    width: Dimensions.get('window').width * 0.85,
    height: 198,
    borderRadius: 10,
    zIndex: 3,
  },
  cardHeaderWrapper: { flex: 1, justifyContent: 'flex-end' },
  cardHeaderArea: {
    backgroundColor: 'rgb(250, 250, 250)',
    borderBottomWidth: 1,
    borderColor: 'rgb(236, 236, 236)',
    padding: 8,
  },
  episodeRow: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginVertical: 4,
  },
  progressBarContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  seriesDescriptionRow: {
    flexDirection: 'row',
  },
  avatarImage: {
    width: 51,
    height: 72,
    borderRadius: 5,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  descriptionRow: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  seriesTitle: {
    fontFamily: 'OpenSans',
    fontWeight: '700',
    marginRight: 5,
    color: colors.white,
    backgroundColor: colors.transparent,
  },
  seriesExtraInfo: {
    fontFamily: 'OpenSans',
    color: colors.lightGrey,
    fontWeight: '300',
    fontSize: 12,
  },
  seriesNextEpisodeTitle: {
    // inherits from extra info,
    fontWeight: 'bold',
    color: '#999999',
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
    marginVertical: 12,
    marginHorizontal: 8,
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
  markWatchedButton: {
    flex: 1,
    backgroundColor: colors.green,
  },
  loadingSpinner: {
    flexGrow: 1,
  },
});

export default styles;
