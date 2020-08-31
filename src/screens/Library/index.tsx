import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} from 'react-native';
import _ from 'lodash';

import { StyledText } from 'app/components/StyledText';
import LibraryScreenHeader from './LibraryScreenHeader';
import LibraryStatusSelector from './LibraryStatusSelector';
import EmptyState from 'app/components/LibraryList/EmptyState';
import styles from './styles';
import { LibraryEntryStatus, Media_Type as MediaType } from 'app/types/graphql';

function TypeSelector({
  visible,
  currentType,
  onSelectType,
  onDismiss,
}: {
  visible: boolean;
  currentType: MediaType;
  onSelectType: (type: MediaType) => void;
  onDismiss: () => void;
}) {
  const reveal = useRef(new Animated.Value(0)).current;
  const [reallyVisible, setReallyVisible] = useState(false);

  useEffect(() => {
    if (visible) setReallyVisible(visible);

    Animated.timing(reveal, {
      toValue: visible ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setReallyVisible(visible));
  }, [visible]);

  const touchableItem = (type: MediaType) => (
    <View style={styles.typeTextContainer}>
      <TouchableOpacity onPress={() => onSelectType(type)}>
        <StyledText
          size="default"
          color="light"
          bold={currentType === type}
          style={styles.typeText}>
          {type}
        </StyledText>
      </TouchableOpacity>
    </View>
  );

  if (reallyVisible) {
    return (
      <View style={styles.typeContainer}>
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
              {touchableItem(MediaType.Anime)}
              {touchableItem(MediaType.Manga)}
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  } else {
    return null;
  }
}

export default function LibraryScreen() {
  const [type, setType] = useState<MediaType>(MediaType.Anime);
  const [status, setStatus] = useState<LibraryEntryStatus>(
    LibraryEntryStatus.Current
  );
  const [typeSelectVisible, setTypeSelectVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <LibraryScreenHeader
        title={type}
        onTitlePress={() => setTypeSelectVisible(!typeSelectVisible)}
        onOptionPress={() => {}}
        onSearchPress={() => {}}
      />
      <View style={{ position: 'relative', flex: 1 }}>
        <TypeSelector
          currentType={type}
          visible={typeSelectVisible}
          onDismiss={() => setTypeSelectVisible(false)}
          onSelectType={(type) => {
            setType(type);
            setTypeSelectVisible(false);
          }}
        />
        <LibraryStatusSelector
          mediaType={type}
          selected={status}
          onSelect={(s) => setStatus(s)}
        />
        <ScrollView>
          <View style={{ height: 10000 }}>
            <EmptyState mediaType={type} status={status} />
            <Text>Placeholder stuff</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
