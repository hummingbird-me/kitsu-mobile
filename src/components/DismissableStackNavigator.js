import React, { PureComponent } from 'react';
import { StackNavigator } from 'react-navigation';

export default function DismissableStackNavigator(routes, options) {
  const StackNav = StackNavigator(routes, options);

  return class DismissableStackNav extends PureComponent {
    static router = StackNav.router;

    render() {
      const { state, goBack } = this.props.navigation;
      // console.log(state);
      const nav = {
        ...this.props.navigation,
        dismiss: () => {
          if (state.routes.length > 2) goBack(state.routes[state.routes.length-1].key);
          else goBack(state.key);
        },
      };
      return <StackNav navigation={nav} />;
    }
  };
}
