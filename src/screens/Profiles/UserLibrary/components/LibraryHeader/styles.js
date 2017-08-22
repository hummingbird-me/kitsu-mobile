import { StyleSheet } from 'react-native';

const text = {
  fontFamily: 'OpenSans',
  fontSize: 12,
  fontWeight: '700',
};

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  listTitleContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listTitle: {
    ...text,
    color: '#c8c4c8',
  },
  viewAllContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewAllText: {
    ...text,
    color: 'white',
    marginRight: 5,
    alignSelf: 'center',
  },
  viewAllArrow: {
    color: 'white',
    fontSize: 12,
    alignSelf: 'center',
    fontWeight: '200',
  },
});
