import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export const SimpleHeader = (props) => {
  const LeftWrapper = props.leftAction ? TouchableOpacity : View;
  const TitleWrapper = props.titleAction ? TouchableOpacity : View;
  const RightWrapper = props.rightAction ? TouchableOpacity : View;

  return (
    <View style={styles.headerContainer}>
      {props.titleContent &&
        <TitleWrapper style={styles.titleContainer} onPress={props.titleAction}>
          {typeof props.titleContent === 'string' ?
            <Text style={styles.headerTitleText}>{props.titleContent}</Text> :
            props.titleContent
          }
        </TitleWrapper>
      }

      {props.leftContent &&
        <LeftWrapper style={styles.leftContainer} onPress={props.leftAction}>
          {typeof props.leftContent === 'string' ?
            <Text style={styles.headerItemText}>{props.leftContent}</Text> :
            props.leftContent
          }
        </LeftWrapper>
      }

      {props.rightContent &&
        <RightWrapper style={styles.rightContainer} onPress={props.rightAction}>
          {typeof props.rightContent === 'string' ?
            <Text style={styles.headerItemText}>{props.rightContent}</Text> :
            props.rightContent
          }
        </RightWrapper>
      }
    </View>
  );
};

SimpleHeader.propTypes = {
  leftAction: PropTypes.any,
  leftContent: PropTypes.any,
  rightAction: PropTypes.any,
  rightContent: PropTypes.any,
  titleAction: PropTypes.any,
  titleContent: PropTypes.any,
};

SimpleHeader.defaultProps = {
  leftAction: null,
  leftContent: null,
  rightAction: null,
  rightContent: null,
  titleAction: null,
  titleContent: null,
};
