import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import glamorous from 'glamorous-native';
import LinearGradient from 'react-native-linear-gradient';
import StyledProgressiveImage from 'kitsu/screens/Profiles/parts/StyledProgressiveImage';

const MaskedImageContainer = glamorous.view({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
});

const StyledLinearGradient = glamorous(LinearGradient)(
  {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '60%',
  },
  ({ position }) => ({
    top: position === 'top' ? -1 : 'auto',
    bottom: position === 'bottom' ? -1 : 'auto',
  }),
);

const Overlay = glamorous.view({
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
});

const StyledImage = glamorous(Image)({
  width: '100%',
  height: '100%',
});

const MaskedImage = ({
  maskedTop = false,
  maskedBottom = false,
  overlay = false,
  resizeMode = 'cover',
  source = {},
  progressive,
}) => {
  const ImageComponent = progressive ? StyledProgressiveImage : StyledImage;
  return (
    <MaskedImageContainer>
      <ImageComponent
        resizeMode={resizeMode}
        source={source}
      />
      {maskedTop && <StyledLinearGradient position="top" colors={['rgba(0,0,0,0.9)', 'transparent']} />}
      {maskedBottom && <StyledLinearGradient position="bottom" colors={['transparent', 'rgba(0,0,0,0.9)']} />}
      {overlay && <Overlay />}
    </MaskedImageContainer>
  );
};

MaskedImage.propTypes = {
  maskedTop: PropTypes.bool,
  maskedBottom: PropTypes.bool,
  progressive: PropTypes.bool,
  overlay: PropTypes.bool,
  resizeMode: PropTypes.string,
  source: PropTypes.object,
};

MaskedImage.defaultProps = {
  maskedTop: false,
  maskedBottom: false,
  progressive: false,
  overlay: false,
  resizeMode: 'cover',
  source: {},
};

export default MaskedImage;
