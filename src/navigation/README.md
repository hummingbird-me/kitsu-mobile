# Navigation Tree

```plaintext
- RootNavigator<Stack>
  - LandingNavigator<Stack>
    - IntroScreen
    - AuthScreen
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
  - MainNavigator<TabBar(layout = Drawer)>
    - StackNavigator(page = "Feed")
    - StackNavigator(page = "Search")
    - StackNavigator(page = "QuickUpdate")
    - StackNavigator(page = "Notifications")
    - StackNavigator(page = "Library")

# This holds basically every screen a logged-in user will come across
- StackNavigator<Stack>
  - Feed
  - Post
  - Search
  - QuickUpdate
  - Notifications
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
