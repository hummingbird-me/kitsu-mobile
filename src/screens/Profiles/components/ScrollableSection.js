import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import glamorous from 'glamorous-native';
import { white } from 'kitsu/constants/colors';
import { scenePadding } from 'kitsu/screens/Profiles/constants';
import SectionHeader from 'kitsu/screens/Profiles/components/SectionHeader';

const Container = glamorous.view(
  {
    paddingTop: scenePadding,
    paddingBottom: scenePadding,
  },
  ({ contentDark }) => ({ backgroundColor: contentDark && white }),
);

const ScrollableSection = ({
  contentDark,
  title,
  titleAction,
  titleLabel,
  onViewAllPress,
  data,
  renderItem,
}) => (
  <Container contentDark={contentDark}>
    <SectionHeader
      title={title}
      titleAction={titleAction}
      titleLabel={titleLabel}
      onViewAllPress={onViewAllPress}
      contentDark={contentDark}
    />
    <View style={{ marginTop: scenePadding }}>
      <FlatList
        contentContainerStyle={{ paddingLeft: scenePadding, marginLeft: -scenePadding }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
      />
    </View>
  </Container>
);

ScrollableSection.propTypes = {
  title: PropTypes.string,
  titleAction: PropTypes.func,
  titleLabel: PropTypes.string,
  contentDark: PropTypes.bool,
  onViewAllPress: PropTypes.func,
  data: PropTypes.array,
  renderItem: PropTypes.func,
};

ScrollableSection.defaultProps = {
  title: '',
  titleAction: null,
  titleLabel: '',
  contentDark: false,
  onViewAllPress: null,
  data: [],
  renderItem: null,
};

export default ScrollableSection;
