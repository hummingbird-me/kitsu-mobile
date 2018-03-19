import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import { isNull, isFunction } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyledText } from 'kitsu/components/StyledText';
import { ProgressBar } from 'kitsu/components/ProgressBar';
import { SectionHeader } from 'kitsu/screens/Profiles/components/SectionHeader';
import { styles } from './styles';

const STATUS_TEXT = {
  current: (type) => {
    if (type === 'manga') return 'Reading';
    return 'Watching';
  },
  planned: (type) => {
    if (type === 'manga') return 'Want to Read';
    return 'Want to Watch';
  },
  completed: 'Completed',
  on_hold: 'On Hold',
  dropped: 'Dropped',
};

export class SummaryProgress extends PureComponent {
  static propTypes = {
    media: PropTypes.object,
    libraryEntry: PropTypes.object,
    onPress: PropTypes.func,
    onEditPress: PropTypes.func,
  }

  static defaultProps = {
    media: null,
    libraryEntry: null,
    onPress: null,
    onEditPress: null,
  }

  render() {
    const { libraryEntry, media, onPress, onEditPress } = this.props;

    const completed = libraryEntry && libraryEntry.status === 'completed';
    const mediaCount = media && (media.episodeCount || media.chapterCount);

    const progress = (libraryEntry && mediaCount && (libraryEntry.progress || 0) / mediaCount) || 0;
    const progressPercentage = Math.floor(progress * 100);

    // The status text for the title
    let statusText = libraryEntry && STATUS_TEXT[libraryEntry.status];
    if (isFunction(statusText)) {
      statusText = (media && statusText(media.type)) || null;
    }

    const titleSuffix = (statusText && ` · ${statusText}`) || '';
    const title = `Progress${titleSuffix}`;

    return (
      <View style={styles.progressWrap}>
        <SectionHeader
          title={title}
          contentDark={false}
          viewAllText="Edit Entry"
          onViewAllPress={libraryEntry && onEditPress}
        />
        <TouchableOpacity onPress={onPress} style={styles.progressContainer}>
          <View
            style={[styles.progressIconCircle, completed && styles.progressIconCircle__completed]}
          >
            {completed && <Icon name="ios-checkmark" color="#FFFFFF" style={styles.progressIcon} />}
          </View>
          <View style={styles.progressStatus}>
            {!libraryEntry &&
              <StyledText size="default" color="grey">
                Not Started
              </StyledText>
            }
            {libraryEntry && completed &&
              <StyledText size="default" color="green">
                Finished!
              </StyledText>
            }
            {libraryEntry && !completed &&
              <ProgressBar
                fillPercentage={progressPercentage}
                height={12}
                backgroundStyle={styles.progressBarBackground}
              />
            }
          </View>
          { libraryEntry &&
            <StyledText size="default" color="black">
              {isNull(libraryEntry.progress) ? '-' : libraryEntry.progress}{mediaCount && ` of ${mediaCount}`}
            </StyledText>
          }
          <Icon name="ios-arrow-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}
