import * as React from 'react';
import { connectSearchBox } from 'react-instantsearch/connectors';
import { SearchBox } from './component';

export const InstantSearchBox = connectSearchBox(
  ({ refine, currentRefinement, placeholder, searchIconOffset, style }) => (
    <SearchBox
      onChangeText={refine}
      value={currentRefinement}
      placeholder={placeholder}
      searchIconOffset={searchIconOffset}
      style={style}
    />
  ),
);
