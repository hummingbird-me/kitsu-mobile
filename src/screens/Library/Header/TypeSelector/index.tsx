import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableWithoutFeedback, Animated } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import _ from 'lodash';

import useScopedTranslation from 'app/hooks/useScopedTranslation';
import { StyledText } from 'app/components/StyledText';
import { MediaTypeEnum } from 'app/types/graphql';

import styles from './styles';

export default function LibraryTypeSelector({
  visible,
  top,
  currentType,
  onSelectType,
  onDismiss,
}: {
  visible: boolean;
  top: number;
  currentType: MediaTypeEnum;
  onSelectType: (type: MediaTypeEnum) => void;
  onDismiss: () => void;
}) {
  const reveal = useRef(new Animated.Value(0)).current;
  const [reallyVisible, setReallyVisible] = useState(false);
  const { t } = useScopedTranslation('LibraryScreen.Header');

  useEffect(() => {
    if (visible) setReallyVisible(visible);

    Animated.timing(reveal, {
      toValue: visible ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setReallyVisible(visible));
  }, [visible]);

  const touchableItem = (type: MediaTypeEnum) => (
    <RectButton
      onPress={() => onSelectType(type)}
      style={styles.typeTextContainer}>
      <StyledText
        size="default"
        color="light"
        bold={currentType === type}
        style={styles.typeText}>
        {t(type)}
      </StyledText>
    </RectButton>
  );

  if (reallyVisible) {
    return (
      <View style={[styles.typeContainer, { top }]}>
        <TouchableWithoutFeedback onPress={onDismiss}>
          <Animated.View style={[styles.opacityFill, { opacity: reveal }]}>
            <Animated.View
              style={[
                styles.typeSelectContainer,
                {
                  transform: [
                    {
                      translateY: reveal.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-100, 0],
                      }),
                    },
                  ],
                },
              ]}>
              {touchableItem(MediaTypeEnum.Anime)}
              {touchableItem(MediaTypeEnum.Manga)}
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  } else {
    return null;
  }
}
