import * as React from 'react';
import { ScrollView, View, ImageBackground, Image } from 'react-native';

import useScopedTranslation from 'app/hooks/useScopedTranslation';
import { ohNo, mystery } from 'app/assets/img/library';
import StyledText from 'app/components/StyledText';
import Button from 'app/components/Button';
import { LibraryEntryStatus, Media_Type as MediaType } from 'app/types/graphql';

import { styles } from './styles';

export default function LibraryEmptyState({
  mediaType,
  status,
  onPress,
}: {
  mediaType: MediaType;
  status: LibraryEntryStatus;
  onPress: () => void;
}) {
  const { t } = useScopedTranslation('LibraryList.EmptyState');

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          style={styles.imageBackground}
          imageStyle={{ resizeMode: 'contain' }}
          source={ohNo}>
          <Image style={styles.image} source={mystery} />
        </ImageBackground>
        <View style={styles.textContainer}>
          <StyledText style={styles.text} color="black" size="large" bold>
            {t('title')}
          </StyledText>
          <StyledText style={styles.text} color="grey" size="small">
            {t('body', { mediaType, status })}
          </StyledText>
        </View>
        <Button kind="green" onPress={onPress}>
          {t('button', { mediaType, status })}
        </Button>
      </View>
    </ScrollView>
  );
}
