import { StyleSheet, Platform } from 'react-native';
import * as colors from 'kitsu/constants/colors';

export const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.lightestGrey,
  },
  emptyBubble: {
    backgroundColor: 'transparent',
  },
  embed: {
    marginTop: 6,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingTop: 5,
  },
  commentActionItem: {
    marginLeft: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    color: colors.grey,
    marginRight: 3,
  },
  likeIcon__active: {
    color: colors.red,
  },
  nestedComments: {
    marginTop: 14,
    marginLeft: 14,
  },
  linkStyle: {
    color: colors.orange,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});
