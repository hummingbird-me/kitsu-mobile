import { StyleSheet } from 'react-native';
import { white, darkPurple } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    justifyContent: 'space-between',
  },
  statusContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    height: 100,
    fontSize: 18,
  },
  authorText: {
    fontWeight: 'bold',
  },
  metaContainer: {
    flexDirection: 'row',
  },
  feedSelector: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'green',
    padding: 6,
    fontSize: 12,
    color: 'green',
  },
  actionsContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#f7f7f7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: 'lightblue',
    borderTopWidth: 1,
  },
  actionHeading: {
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionItem: {
    paddingLeft: 6,
    paddingRight: 6,
    fontSize: 15,
  },
  actionGIF: {
    backgroundColor: 'red',
    color: '#fff',
    borderRadius: 6,
    fontSize: 13,
  },
});

export default styles;
