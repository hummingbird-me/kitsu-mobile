import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  ListView,
  View,
} from 'react-native';

import { styles } from './styles';

export class PhotoGrid extends React.Component {
  constructor() {
    super();

    this.state = {
      data: new ListView.DataSource({
        rowHasChanged: (r1, r2) => { r1 !== r2; },
      }),
    };
  }

  buildRows(items, itemsPerRow = 3) {
    return items.reduce((rows, item, idx) => {
      // If a full row is filled create a new row array
      if (idx % itemsPerRow === 0 && idx > 0) rows.push([]);
      rows[rows.length - 1].push(item);
      return rows;
    }, [[]]);
  }

  renderRow(items) {
    // Calculate the width of a single item based on the device width
    // and the desired margins between individual items
    const deviceWidth = Dimensions.get('window').width;
    const itemsPerRow = this.props.itemsPerRow;
    const margin = this.props.itemMargin || 1;

    const totalMargin = margin * (itemsPerRow - 1);
    const itemWidth = Math.floor((deviceWidth - totalMargin) / itemsPerRow);
    const adjustedMargin = (deviceWidth - (itemsPerRow * itemWidth)) / (itemsPerRow - 1);

    return (
      <View style={[styles.row, { marginBottom: adjustedMargin }]}>
        { items.map(item => this.props.renderItem(item, itemWidth)) }
        { itemsPerRow - items.length > 0 && (
          <View style={{ width: itemWidth * (itemsPerRow - items.length) }} />
        )}
      </View>
    );
  }

  render() {
    const rows = this.buildRows(this.props.data, this.props.itemsPerRow);

    return (
      <ListView
        {...this.props}
        dataSource={this.state.data.cloneWithRows(rows)}
        renderRow={this.renderRow.bind(this)}
        style={{ flex: 1 }}
      />
    );
  }
}

PhotoGrid.propTypes = {
  itemsPerRow: PropTypes.number,
  itemMargin: PropTypes.number,
  renderItem: PropTypes.func,
  renderRow: PropTypes.func,
  data: PropTypes.array,
};

PhotoGrid.defaultProps = {
  itemsPerRow: 3,
  itemMargin: 1,
  renderItem: null,
  renderRow: null,
  data: [],
};
