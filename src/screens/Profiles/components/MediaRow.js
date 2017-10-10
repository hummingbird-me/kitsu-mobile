import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { scenePadding } from 'kitsu/screens/Profiles/constants';
import ImageCard from 'kitsu/screens/Profiles/components/ImageCard';
import { StyledText } from 'kitsu/screens/Profiles/parts';

const Row = glamorous.view(
  {
    padding: scenePadding,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
);

const Image = glamorous.view({
  marginRight: scenePadding,
});

const Main = glamorous.view({
  flex: 1,
});

const MediaRow = ({ imageVariant, title, summary, thumbnail, summaryLines }) => {
  return (
    <Row>
      <Image>
        <ImageCard
          noMask
          variant={imageVariant}
          source={thumbnail}
        />
      </Image>
      <Main>
        <StyledText color="dark" size="small" bold>{title}</StyledText>
        <StyledText color="grey" size="xsmall" numberOfLines={summaryLines} style={{ marginTop: 5 }}>{summary}</StyledText>
      </Main>
    </Row>
  );
};


MediaRow.propTypes = {
  imageVariant: PropTypes.oneOf(['portrait', 'landscape', 'landscapeSmall']),
  title: PropTypes.string,
  summary: PropTypes.string,
  thumbnail: PropTypes.object,
  summaryLines: PropTypes.number,
};

MediaRow.defaultProps = {
  imageVariant: 'portrait',
  title: '',
  summary: '',
  thumbnail: {},
  summaryLines: 3,
};

export default MediaRow;
