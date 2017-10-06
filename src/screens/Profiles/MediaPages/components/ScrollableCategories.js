import React from 'react';
import PropTypes from 'prop-types';
import { Pill, HScrollContainer, HScrollItem } from '../parts';

const ScrollableCategories = ({ categories }) => {
  const categoryPills = categories.map(category => (
    <HScrollItem key={category.key} spacing={5}>
      <Pill label={category.title} />
    </HScrollItem>
  ));

  return (
    <HScrollContainer spacing={5}>
      {categoryPills}
    </HScrollContainer>
  );
};

ScrollableCategories.propTypes = {
  categories: PropTypes.array,
};

ScrollableCategories.defaultProps = {
  categories: [],
};

export default ScrollableCategories;
