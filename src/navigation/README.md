# Navigation Tree

```plaintext
- RootNavigator<Stack>
  - LandingNavigator<Stack>
    - IntroScreen
    - AuthScreen
      # Non-navigator subscreens
      - Register
      - SignIn
      - ForgotPassword
      - ViewTerms
  - Onboarding<Stack>
    - Aozora
    - AozoraPicker
    - AozoraRegistration
    - Categories
    - RatingSystem
    - Import
    - Build
      - Rate
  - AozoraOnboarding
    - Greeting
    - Picker
    - Registration
    - Onboarding.Categories
    - Onboarding.RatingSystem
    - AozoraManga (build)
  - ProfileDrawerNavigator
    - HomeNavigator = MainNavigator(page = "Feed")
    - SearchNavigator = MainNavigator(page = "Search")
    - QuickUpdateNavigator = MainNavigator(page = "QuickUpdate")
    - NotificationsNavigator = MainNavigator(page = "Notifications")
    - LibraryNavigator = MainNavigator(page = "Library")

- MainNavigator<Stack>
  - Profile
    - Summary
    - About
    - Library
    - Groups
    - Reactions
    - Favorites
    - Followers
  - Group
  - Media
    - Episodes
    - Episode
    - Characters
    - Reactions
    - Franchise
```
