import React, { PureComponent } from 'react';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import * as PropTypes from 'prop-types';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { isEqual, intersectionWith } from 'lodash';
import { bestSpacing, getCurrentVisibleRows } from './spacing';
import { ResultsListItem } from './item';
import { styles } from './styles';

const LAYOUT_PROVIDER_TYPE = 'ResultsListItem';

export class ResultsList extends PureComponent {
  static propTypes = {
    hits: PropTypes.array.isRequired,
    onPress: PropTypes.func.isRequired,
    style: ViewPropTypes.style,
    rowHasChanged: PropTypes.func,
    currentUser: PropTypes.object,
    onEndReached: PropTypes.func,
  };

  static defaultProps = {
    style: null,
    rowHasChanged: null,
    currentUser: null,
    onEndReached: null,
  };

  state = {
    dataProvider: null,
    layoutProvider: null,
  };

  componentWillMount() {
    const rowHasChanged = this.props.rowHasChanged || this.rowHasChanged;
    const dataProvider = new DataProvider(rowHasChanged).cloneWithRows(this.props.hits.slice());

    // Only one type of row item
    const layoutProvider = new LayoutProvider(() => LAYOUT_PROVIDER_TYPE, (type, dim) => {
      const margin = bestSpacing.margin || 0;
      const width = bestSpacing.width || 0;
      const height = bestSpacing.height || 0;

      switch (type) {
        case LAYOUT_PROVIDER_TYPE: {
          // We need to take into account the margins here
          dim.width = width + (margin * 2);
          dim.height = height + (margin * 2);
          break;
        }
        default:
          dim.width = 0;
          dim.height = 0;
          break;
      }
    });

    this.setState({ dataProvider, layoutProvider });
  }

  componentWillReceiveProps(newProps) {
    // Length is different
    const oldHits = this.props.hits;
    const newHits = newProps.hits;
    const differentLength = (oldHits && oldHits.length) !== (newHits && newHits.length);

    // We need to check if there are any updated hits
    const intersection = intersectionWith(oldHits, newHits, isEqual);
    const hasUpdatedHits = oldHits.length !== intersection.length;

    // Only update if we really need to
    if (differentLength || hasUpdatedHits) {
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows(newHits),
      });
    }
  }

  rowHasChanged = (rowA, rowB) => {
    // Check types first
    if (typeof rowA !== typeof rowB) return true;

    // If the rows don't have ids or are the same
    // Then we check if the data within them is different
    if ((!rowA.id && !rowB.id) || (rowA.id === rowB.id)) {
      return !isEqual(rowA, rowB);
    }

    // Rows are different
    return true;
  }

  renderRow = (_type, data) => (
    <ResultsListItem
      item={data}
      spacing={bestSpacing}
      onPress={this.props.onPress}
      currentUser={this.props.currentUser}
    />
  );

  // We need to render up to 20 visible items
  renderRowCount = Math.max(getCurrentVisibleRows(20) + 1, 5);

  render() {
    const { dataProvider, layoutProvider } = this.state;
    const { onEndReached, hits, style, ...props } = this.props;

    // If we have no data then don't render anything otherwise RecyclerListView may cause a crash
    if (dataProvider.getSize() === 0) return null;

    // This will make it so the list will be centred should we have any extra space left over
    const padding = { paddingLeft: bestSpacing.extra / 2, paddingTop: bestSpacing.margin / 2 };

    return (
      <RecyclerListView
        renderAheadOffset={(bestSpacing.height || 50) * this.renderRowCount}
        style={[styles.container, padding, style]}
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={this.renderRow}
        onEndReachedThreshold={bestSpacing.height}
        {...props}
        onEndReached={onEndReached}
      />
    );
  }
}
