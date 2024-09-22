# Kitsu Mobile

---

**<p align="center">This is our mobile repository. It contains the Expo (React Native) app.<br />Check out the [tools], [web], [server] and [api docs] repositories.</p>**

[tools]: https://github.com/hummingbird-me/kitsu-tools
[web]: https://github.com/hummingbird-me/hummingbird-client
[server]: https://github.com/hummingbird-me/kitsu-server
[api docs]: https://github.com/hummingbird-me/api-docs

---

## Setup

Install [Node 22](https://nodejs.org/en/download) and
[Ruby 3.3](https://www.ruby-lang.org/en/documentation/installation/).

Follow the [Expo setup guide](https://docs.expo.dev/get-started/set-up-your-environment/). Make sure
to select your intended platform (iOS or Android), "Development Client" (not "Expo Go"), and uncheck
Expo Application Services (EAS), which we only really use for release builds right now.

Remember: this is a cross-platform app, so you can develop with Android on any OS, or iOS on a Mac.
If you don't have a Mac, just develop on Android and let us know so we can test your stuff on iOS!

Also, they don't mention it everywhere, but [Expo Orbit](https://docs.expo.dev/develop/tools/#orbit)
is a great tool for managing your development environment, especially if you're testing against
multiple emulators!

### Running it

1. Run `npm install`
2. Run `bundle install`
3. Run `npx expo prebuild` to generate the native app code
4. Run `npx expo run:ios` or `npx expo run:android` to start the app in an emulator
   - If you're doing both at the same time, you can run `npx expo start` to start the Metro bundler,
     then run the above `run:*` commands in separate tabs with `--no-bundler` to skip starting the
     bundler again for each OS.
   - If you're running on a physical device, you can also pass `--device` to the `run:*` commands.

### Navigating the Codebase

While Kitsu is an Expo application, it's inherited a lot of cruft from the React Native days. As
such, the codebase is structured a bit oddly right now as we work to modernize it.

#### Entry Point

The application starts at `index.js`, which pretty much just calls the top level `App` component and
registers it as the root.

#### Application Source Code

- [`src/App.tsx`](./src/App.tsx) — the main application component, renders the initializer,
  contexts, and navigator.
- [`src/assets/`](./src/assets/) — static assets like icons, illustrations, and animations imported
  by the application.
- [`src/components/`](./src/components/) — common, reusable components
  - [`src/components/content/`](./src/components/content/) — simple components for rendering
    content. Generally have minimal interactivity logic, but may navigate or contain other
    interactive components.
  - [`src/components/controls/`](./src/components/controls/) — interactive components, such as
    inputs, buttons, checkboxes, switches, etc.
  - [`src/components/feedback/`](./src/components/feedback/) — components for providing feedback to
    the user, such as toasts, modals, and loading spinners. Capitalized until we replace the
    Feedback component with a more modern solution. Please pretend you do not see it.
- [`src/screens/`](./src/screens/) — components rendering a whole screen in the application.
- [`src/navigation/`](./src/navigation/) — the application's navigation setup, including the nested
  navigators for the main app, onboarding flow, modals, etc.
- [`src/contexts/`](./src/contexts/) — React contexts for sharing state between components and
  initializing said shared state (loading account, loading locale data, etc.)
- [`src/initializers/`](./src/initializers/) — imperative code which runs during app boot, such as
  loading fonts, setting up Android Edge-to-Edge mode, initializing Sentry, etc. Gets wrapped by the
  [`Initializer`](./src/screens/BootAnimation/Initializer.tsx) component (which is also our
  top-level suspense and error boundary).
- [`src/graphql/`](./src/graphql/) — GraphQL support code, such as the generated schema types,
  scalars, and urql exchanges.
- [`src/hooks/`](./src/hooks/) — custom react hooks for the application
- [`src/locales/`](./src/locales/) — data for every locale we support (translations, date-fn
  locales, zxcvbn-ts locales, etc.)
- [`src/errors/`](./src/errors/) — all our error subclasses
- [`src/utils/`](./src/utils/) — non-hook utility functions and classes. Much of this is still
  legacy code, beware.
- [`src/store/`](./src/store/) — the legacy Redux store, which we're in the process of replacing
  with Urql and React Contexts and useState. We still have Redux installed and configured, so if
  it's helpful you can still refactor an existing set of actions to `createSlice` and
  `createAsyncThunk`, but it's often faster to just ditch it entirely.

#### Key Libraries

- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Expo](https://expo.dev/) (based on [React Native](https://reactnative.dev/))
- **Testing:** [Jest](https://jestjs.io/) w/ [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Navigation:** [React Navigation](https://reactnavigation.org) v7 (but lots of dead code references
  [React Native Navigation](https://wix.github.io/react-native-navigation/) still)
- **GraphQL Client:** [Urql](https://formidable.com/open-source/urql/) with
  [Graphcache](https://formidable.com/open-source/urql/docs/graphcache/) enabled and
  [gql.tada](https://gql-tada.0no.co) for typing.
- **Internationalization/Localization:** [React Intl](https://formatjs.io/docs/react-intl/)
- **Time:** [date-fns](https://date-fns.org)

#### Debugging

Expo has an [excellent guide on debugging](https://docs.expo.dev/debugging/tools/) that you can use!
