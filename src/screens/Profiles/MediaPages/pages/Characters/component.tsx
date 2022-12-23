import React, { PureComponent } from 'react';

import { PhotoGrid } from 'kitsu/screens/Profiles/components/PhotoGrid';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { TabHeader } from 'kitsu/screens/Profiles/components/TabHeader';

interface CharactersProps {
  castings: unknown[];
}

class Characters extends PureComponent<CharactersProps> {
  static defaultProps = {
    castings: null,
  };

  renderCharacters = () => {
    const { castings } = this.props;
    if (!castings) return null;

    return <PhotoGrid photos={castings} />;
  };

  render() {
    return (
      <TabContainer light padded>
        {this.renderCharacters()}
      </TabContainer>
    );
  }
}

export const component = Characters;
