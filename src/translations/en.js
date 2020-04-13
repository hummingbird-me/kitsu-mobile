export default {
  components: {
    account: {
      password: "Password",
      email: "Email",
      username: "Username",
      confirmpassword: "Confirm Password",
      create: "Create account",
      signin: "Sign in to your account",
      reset: "Send password reset",
      facebook: "Login with Facebook",
      termspart1: "By creating an account, you agree our ",
      termspart2: "Terms of Service"
    },
    button: {
      save: "Save"
    },
    contentlist: {
      viewall: "View All"
    },
    datepicker: {
      cancel: "Cancel",
      select: "Select a Date",
      confirm: "Confirm"
    },
    feedback: {
      error: "Something went wrong."
    },
    profileheader: {
      follow: "Follow"
    },
    rating: {
      awful: "AWFUL",
      meh: "MEH",
      good: "GOOD",
      great: "GREAT",
      error: "This function should only be used in simple ratings.",
      unknown: "Unknown text while determining simple rating type:",
      notrated: "Not Rated",
      tap: "Tap",
      slide: "Slide",
      torate: " to Rate",
      slidetorate: "Slide to rate",
      cancel: "Cancel",
      done: "Done",
      norating: "No Rating"
    },
    searchbox: {
      search: "Search"
    },
    viewmore: {
    more: "View more",
    less: "View less",
    }
  },
  config: {
    middlewares: {
      error401: "Recieved a 401",
      tokens: "Failed to refresh tokens",
      token: "Failed to refresh token"
    }
  },
  screens: {
    sidebar: {
      sidebarscreen: {
        account: "Account Settings",
        settings: "Settings & Preferences",
        report: "Report Bugs",
        features: "Suggest Features",
        database: "Database Requests",
        contact: "Contact Us",
        profile: "View Profile",
        logout: "Logout"
      }
    }
  },
  store: {
    auth: {
      emptytokens: "Empty tokens received",
      loginfacebook: "Failed to log in facebook",
      logwithfacebook: "Failed to login with Facebook",
      currentuser: "Failed to fetch current user",
      user: "Failed to fetch user",
      credentials: "Wrong credentials",
      facebooktoken: "Invalid Facebook Access Token"
    },
    feed: {
      notificationtype: "Notification Type must be \"seen\" or \"read\"",
      invalidid: "User ID is not valid",
      invalidtoken: "User Tokens are not valid"
    },
    groups: "Failed to load groups",
    media: {
      error: "Failed to load reactions"
    }


  },
  utils: {
    deeplink: {
      error: "An error occurred",
      bugs: "Report Bugs",
      features: "Suggest Features",
      database: "Database Requests"
    },
    genres: {
      action: "Action",
      adventure: "Adventure",
      animeinfluenced: "Anime Influenced",
      cars: "Cars",
      comedy: "Comedy",
      cooking: "Cooking",
      crime: "Crime",
      dementia: "Dementia",
      demons: "Demons",
      documentary: "Documentary",
      doujinshi: "Doujinshi",
      drama: "Drama",
      ecchi: "Ecchi",
      family: "Family",
      fantasy: "Fantasy",
      food: "Food",
      friendship: "Friendship",
      game: "Game",
      genderbender: "Gender Bender",
      gore: "Gore",
      harem: "Harem",
      hentai: "Hentai",
      historical: "Historical",
      horror: "Horror",
      kids: "Kids",
      law: "Law",
      magic: "Magic",
      mahoushoujo: "Mahou Shoujo",
      mahoushounen: "Mahou Shounen",
      martialarts: "Martial Arts",
      mature: "Mature",
      mecha: "Mecha",
      medical: "Medical",
      military: "Military",
      music: "Music",
      mystery: "Mystery",
      parody: "Parody",
      police: "Police",
      political: "Political",
      psychological: "Psychological",
      racing: "Racing",
      romance: "Romance",
      samurai: "Samurai",
      school: "School",
      scifi: "Sci-Fi",
      shoujoai: "Shoujo Ai",
      shounenai: "Shounen Ai",
      sliceoflife: "Slice of Life",
      space: "Space",
      sports: "Sports",
      superpower: "Super Power",
      supernatural: "Supernatural",
      thriller: "Thriller",
      tokusatsu: "Tokusatsu",
      tragedy: "Tragedy",
      vampire: "Vampire",
      workplace: "Workplace",
      yaoi: "Yaoi",
      youth: "Youth",
      yuri: "Yuri",
      zombies: "Zombies"
    },
    imageuploader: {
      uploading: "Already uploading images",
      missingtokens: "Missing authentication tokens",
      error: "Images must contain `uri` and `mime` properties."
    },
    notifications: {
      followed: "followed you.",
      mentioned: "mentioned you in a post.",
      likedpost: "liked your post.",
      likedcomment: "liked your comment.",
      invited: "invited you to a group.",
      likedreaction: "liked your reaction.",
      aired: {
        episode: "Episode",
        chapter: "Chapter",
        aired: "aired",
        released: "released"
      },
      mentioned: "mentioned you in a comment.",
      replied: "replied to",
      action: "made an action"
    }
  }
};
