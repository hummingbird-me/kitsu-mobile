import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { white } from 'kitsu/constants/colors';
import { scenePadding } from '../constants';
import SectionHeader from './SectionHeader';
import { HScrollContainer } from '../parts';

const Container = glamorous.view(
  {
    paddingTop: scenePadding,
    paddingBottom: scenePadding,
  },
  ({ contentDark }) => ({ backgroundColor: contentDark && white }),
);

const SectionBox = ({ contentDark, title, titleAction, titleLabel, onViewAllPress, ...props }) => (
  <Container contentDark={contentDark}>
    <SectionHeader
      title={title}
      titleAction={titleAction}
      titleLabel={titleLabel}
      onViewAllPress={onViewAllPress}
      contentDark={contentDark}
    />
    <HScrollContainer {...props} />
  </Container>
);

SectionBox.propTypes = {
  title: PropTypes.string,
  titleAction: PropTypes.func,
  titleLabel: PropTypes.string,
  contentDark: PropTypes.bool,
  onViewAllPress: PropTypes.func,
};

SectionBox.defaultProps = {
  title: '',
  titleAction: null,
  titleLabel: '',
  contentDark: false,
  onViewAllPress: null,
};

export default SectionBox;
