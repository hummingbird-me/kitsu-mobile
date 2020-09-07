import React, { useState } from 'react';
import { View, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackHeaderProps, StackNavigationProp } from '@react-navigation/stack';
import { useLayout } from '@react-native-community/hooks';

import { Media_Type as MediaType, LibraryEntryStatus } from 'app/types/graphql';
import useScopedTranslation from 'app/hooks/useScopedTranslation';
import { StyledText } from 'app/components/StyledText';
import { MainNavigatorParamList } from 'app/navigation/MainNavigator';
import Touchable from 'app/components/Touchable';

import StatusSelector from './StatusSelector';
import TypeSelector from './TypeSelector';
import { styles } from './styles';

export default function LibraryScreenHeader({
  insets: { top, left, right },
  navigation,
  scene: { route },
}: StackHeaderProps & {
  navigation: StackNavigationProp<MainNavigatorParamList, 'Library'>;
  scene: {
    route: RouteProp<MainNavigatorParamList, 'Library'>;
  };
}) {
  const { type = MediaType.Anime, status = LibraryEntryStatus.Current } =
    route.params ?? {};
  const { t } = useScopedTranslation('LibraryScreen');
  const [typeSelectVisible, setTypeSelectVisible] = useState(false);
  const { onLayout, height } = useLayout();

  return (
    <>
      <View style={styles.headerContainer} onLayout={onLayout}>
        <View
          style={[
            styles.headerContent,
            { marginTop: top, marginLeft: left, marginRight: right },
          ]}>
          <Touchable
            borderless
            style={styles.headerTitle}
            onPress={() => setTypeSelectVisible(!typeSelectVisible)}>
            <StyledText color="light" size="default" bold>
              {t(`Header.${type}`)}
            </StyledText>
            <Ionicons
              name="ios-arrow-down"
              color="white"
              style={styles.arrowIcon}
            />
          </Touchable>
          <View style={styles.rightButtons}>
            <Touchable
              borderless
              onPress={() => 'CLICK'}
              style={styles.rightButton}>
              <Ionicons
                name="ios-options"
                color="white"
                style={styles.rightIcon}
              />
            </Touchable>
            <Touchable
              borderless
              onPress={() => 'CLICK'}
              style={styles.rightButton}>
              <Ionicons
                name="ios-search"
                color="white"
                style={styles.rightIcon}
              />
            </Touchable>
          </View>
        </View>
      </View>
      <StatusSelector
        mediaType={type}
        selected={status}
        onSelect={(s) => navigation.setParams({ status: s })}
      />
      <TypeSelector
        currentType={type}
        top={height}
        visible={typeSelectVisible}
        onDismiss={() => setTypeSelectVisible(false)}
        onSelectType={(type) => {
          navigation.setParams({ type });
          setTypeSelectVisible(false);
        }}
      />
    </>
  );
}
