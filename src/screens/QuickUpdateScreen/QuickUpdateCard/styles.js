import { Dimensions, StyleSheet } from 'react-native';

import * as colors from 'kitsu/constants/colors';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.85,
    height: 310,
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
    fontSize: 12,
  },
  totalEpisodesText: {
    backgroundColor: 'transparent',
    color: '#999999',
    fontFamily: 'OpenSans',
    fontSize: 12,
    flex: 1,
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
    marginTop: 4,
    marginBottom: 2,
  },
  progressBarContainer: {
    marginTop: 8,
    marginBottom: 6,
    marginRight: 4,
    height: 6,
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
    justifyContent: 'flex-end',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  seriesTitle: {
    fontFamily: 'OpenSans',
    fontWeight: '600',
    marginRight: 5,
    color: colors.white,
    backgroundColor: colors.transparent,
  },
  seriesExtraInfo: {
    fontFamily: 'OpenSans',
    color: colors.grey,
    fontWeight: '200',
    fontSize: 12,
    marginRight: 5,
  },
  seriesNextEpisodeTitle: {
    // inherits from extra info,
    fontWeight: 'bold',
    color: '#999999',
  },
  seriesFinishedTitle: {
    color: '#999999',
    fontWeight: 'bold',
    marginTop: 1,
    fontSize: 12,
    fontFamily: 'OpenSans',
    textAlign: 'center',
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
    alignItems: 'center',
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
  seriesCompleteText: {
    color: colors.darkGrey,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'OpenSans',
  },
  markWatchedButton: {
    flex: 1,
    backgroundColor: colors.green,
  },
  loadingSpinner: {
    flexGrow: 1,
    marginTop: 8,
  },
});

export default styles;
