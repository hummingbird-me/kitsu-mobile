import { StyleSheet } from 'react-native';
import { white } from 'kitsu/constants/colors';

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
    marginTop: 10,
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
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: 'lightblue',
    borderTopWidth: 1,
  },
  actionHeading: {
    fontSize: 17,
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
    backgroundColor: '#F5166F',
    color: '#fff',
    borderRadius: 6,
    fontSize: 13,
  },
  actionImageIcon: {
    color: '#89BF4C',
    fontSize: 18,
  },
});

export default styles;
