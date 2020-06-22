import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TabHeader } from 'app/screens/Profiles/components/TabHeader';
import { TabContainer } from 'app/screens/Profiles/components/TabContainer';
import { PhotoGrid } from 'app/screens/Profiles/components/PhotoGrid';

class Characters extends PureComponent {
  static propTypes = {
    castings: PropTypes.array.isRequired,
  }

  static defaultProps = {
    castings: null,
  }

  renderCharacters = () => {
    const { castings } = this.props;
    if (!castings) return null;

    return (
      <PhotoGrid photos={castings} />
    );
  }

  render() {
    return (
      <TabContainer light padded>
        {this.renderCharacters()}
      </TabContainer>
    );
  }
}

export const component = Characters;
