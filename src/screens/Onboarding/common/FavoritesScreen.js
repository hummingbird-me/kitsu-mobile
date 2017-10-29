import React from 'react';
import { View, Text, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Button } from 'kitsu/components/Button';
import { Pill } from 'kitsu/components/Pill';
import { styles as commonStyles } from './styles';

const COLOR_LIST = ['#d95e40', '#f2992e', '#56bc8a', '#529ecc', '#a77dc2'];
class CreateAccountScreen extends React.Component {
  state = {
    pills: [
      {
        name: 'Action',
        selected: false,
        subpills: [
          {
            name: 'The Town',
            selected: false,
          },
          {
            name: 'Captain Phillips',
            selected: false,
          },
          {
            name: 'Barry Seal',
            selected: false,
          },
        ],
      },
      {
        name: 'Adventure',
        selected: false,
        subpills: [
          {
            name: 'Mad Max',
            selected: false,
          },
          {
            name: 'Matrix',
            selected: false,
          },
        ],
      },
      {
        name: 'Comedy',
        selected: false,
        subpills: [
          {
            name: 'Mad Max',
            selected: false,
          },
          {
            name: 'Matrix',
            selected: false,
          },
        ],
      },
      {
        name: 'Sports',
        selected: false,
        subpills: [
          {
            name: 'Baseball',
            selected: false,
          },
          {
            name: 'Basketball',
            selected: false,
          },
          {
            name: 'Card Game',
            selected: false,
          },
          {
            name: 'Cycling',
            selected: false,
          },
          {
            name: 'Motorsport',
            selected: false,
          },
          {
            name: 'Soccer',
            selected: false,
          },
          {
            name: 'Tennis',
            selected: false,
          },
          {
            name: 'Volleyball',
            selected: false,
          },
        ],
      },
      {
        name: 'Past',
        selected: false,
        subpills: [
          {
            name: 'Mad Max',
            selected: false,
          },
          {
            name: 'Matrix',
            selected: false,
          },
        ],
      },
      {
        name: 'Cooking',
        selected: false,
        subpills: [
          {
            name: 'Mad Max',
            selected: false,
          },
          {
            name: 'Matrix',
            selected: false,
          },
        ],
      },
      {
        name: 'Revenge',
        selected: false,
        subpills: [
          {
            name: 'Mad Max',
            selected: false,
          },
          {
            name: 'Matrix',
            selected: false,
          },
        ],
      },
      {
        name: 'Magical Girl',
        selected: false,
        subpills: [
          {
            name: 'Mad Max',
            selected: false,
          },
          {
            name: 'Matrix',
            selected: false,
          },
        ],
      },
    ],
  };

  componentDidMount() {
    const pills = this.state.pills.slice();
    for (let i = 0; i < pills.length; i += 1) {
      const index = i % 5;
      pills[i].color = COLOR_LIST[index];
    }
    this.setState({ pills });
  }

  onConfirm = () => {
    this.props.navigation.navigate('RatingSystemScreen');
  };

  onPressPill = (pill, index, isSubpill) => {
    const pills = this.state.pills.slice();
    if (!isSubpill) {
      if (pill.selected) {
        pills.splice(index + 1, pill.subpills.length);
      } else {
        const subpills = pill.subpills;
        for (let i = 0; i < subpills.length; i += 1) {
          subpills[i].color = pill.color;
        }
        pills.splice(index + 1, 0, ...subpills);
      }
    }
    pills[index].selected = !pill.selected;

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ pills });
  };

  render() {
    const { pills } = this.state;
    const buttonDisabled = pills.filter(v => v.selected).length < 5;
    const buttonTitle = buttonDisabled ? 'Pick at least 5' : 'Looks good!';
    return (
      <View style={commonStyles.container}>
        <View style={commonStyles.contentWrapper}>
          <Text style={commonStyles.tutorialText}>
            Tap categories you like, we’ll use these to help you find new anime and manga.
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              padding: 4,
              marginTop: 12,
            }}
          >
            {pills.map((v, i) => (
              <Pill
                selected={v.selected}
                onPress={() => this.onPressPill(v, i, !v.subpills)}
                color={v.color}
                name={v.name}
              />
            ))}
          </View>
          <Button
            disabled={buttonDisabled}
            style={{ marginHorizontal: 0, marginTop: 36 }}
            onPress={this.onConfirm}
            title={buttonTitle}
            titleStyle={commonStyles.buttonTitleStyle}
          />
        </View>
      </View>
    );
  }
}

export default CreateAccountScreen;
