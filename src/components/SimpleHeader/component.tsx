import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

interface SimpleHeaderProps {
  leftAction?: any;
  leftContent?: any;
  rightAction?: any;
  rightContent?: any;
  titleAction?: any;
  titleContent?: any;
}

export const SimpleHeader = (props: SimpleHeaderProps) => {
  const LeftWrapper = props.leftAction ? TouchableOpacity : View;
  const TitleWrapper = props.titleAction ? TouchableOpacity : View;
  const RightWrapper = props.rightAction ? TouchableOpacity : View;

  const leftAction = props.leftAction ? () => props.leftAction() : null;
  const titleAction = props.titleAction ? () => props.titleAction() : null;
  const rightAction = props.rightAction ? () => props.rightAction() : null;

  // FIXME: This view isn't properly styled (content is not centered properley in the bar)
  // Due to time constraints though it's being left as is since it looks very similar
  // to the original navigation style.
  return (
    <View style={styles.headerContainer}>
      {props.titleContent && (
        <TitleWrapper style={styles.titleContainer} onPress={titleAction}>
          {typeof props.titleContent === 'string' ? (
            <Text style={styles.headerTitleText}>{props.titleContent}</Text>
          ) : (
            props.titleContent
          )}
        </TitleWrapper>
      )}

      {props.leftContent && (
        <LeftWrapper style={styles.leftContainer} onPress={leftAction}>
          {typeof props.leftContent === 'string' ? (
            <Text style={styles.headerItemText}>{props.leftContent}</Text>
          ) : (
            props.leftContent
          )}
        </LeftWrapper>
      )}

      {props.rightContent && (
        <RightWrapper style={styles.rightContainer} onPress={rightAction}>
          {typeof props.rightContent === 'string' ? (
            <Text style={styles.headerItemText}>{props.rightContent}</Text>
          ) : (
            props.rightContent
          )}
        </RightWrapper>
      )}
    </View>
  );
};

SimpleHeader.defaultProps = {
  leftAction: null,
  leftContent: null,
  rightAction: null,
  rightContent: null,
  titleAction: null,
  titleContent: null,
};
