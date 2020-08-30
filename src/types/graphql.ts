export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date, expressed as an ISO8601 string */
  Date: any;
  /** An ISO 8601-encoded date */
  ISO8601Date: any;
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: any;
  /** A loose key-value map in GraphQL */
  Map: any;
  Upload: any;
};

/** A user account on Kitsu */
export type Account = WithTimestamps & {
  readonly __typename?: 'Account';
  /** The country this user resides in */
  readonly country?: Maybe<Scalars['String']>;
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** The email addresses associated with this account */
  readonly email: ReadonlyArray<Scalars['String']>;
  /** Facebook account linked to the account */
  readonly facebookId?: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  /** Primary language for the account */
  readonly language?: Maybe<Scalars['String']>;
  /** Longest period an account has had a PRO subscription for in seconds */
  readonly maxProStreak?: Maybe<Scalars['Int']>;
  /** The PRO subscription for this account */
  readonly proSubscription?: Maybe<ProSubscription>;
  /** The profile for this account */
  readonly profile: Profile;
  /** Media rating system used for the account */
  readonly ratingSystem: RatingSystem;
  /** Whether Not Safe For Work content is accessible */
  readonly sfwFilter?: Maybe<Scalars['Boolean']>;
  /** Time zone of the account */
  readonly timeZone?: Maybe<Scalars['String']>;
  /** Preferred language for media titles */
  readonly titleLanguagePreference?: Maybe<TitleLanguagePreference>;
  /** Twitter account linked to the account */
  readonly twitterId?: Maybe<Scalars['String']>;
  readonly updatedAt: Scalars['ISO8601DateTime'];
};

export type AgeRating = 
  /** Acceptable for all ages */
  | 'G'
  /** Parental guidance suggested; should be safe for preteens and older */
  | 'PG'
  /** Possible lewd or intense themes; should be safe for teens and older */
  | 'R'
  /** Contains adult content or themes; should only be viewed by adults */
  | 'R18';

/** Generic Amount Consumed based on Media */
export type AmountConsumed = {
  /** Total media completed atleast once. */
  readonly completed: Scalars['Int'];
  readonly id: Scalars['ID'];
  /** Total amount of media. */
  readonly media: Scalars['Int'];
  /** The profile related to the user for this stat. */
  readonly profile: Profile;
  /** Last time we fully recalculated this stat. */
  readonly recalculatedAt: Scalars['ISO8601Date'];
  /** Total progress of library including reconsuming. */
  readonly units: Scalars['Int'];
};

export type Anime = Media & Episodic & WithTimestamps & {
  readonly __typename?: 'Anime';
  /** The recommended minimum age group for this media */
  readonly ageRating?: Maybe<AgeRating>;
  /** An explanation of why this received the age rating it did */
  readonly ageRatingGuide?: Maybe<Scalars['String']>;
  /** The average rating of this media amongst all Kitsu users */
  readonly averageRating?: Maybe<Scalars['Float']>;
  /** A large banner image for this media */
  readonly bannerImage: Image;
  /** A list of categories for this media */
  readonly categories: CategoryConnection;
  /** The characters who starred in this media */
  readonly characters: MediaCharacterConnection;
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** A brief (mostly spoiler free) summary or description of the media. */
  readonly description: Scalars['Map'];
  /** the day that this media made its final release */
  readonly endDate?: Maybe<Scalars['Date']>;
  /** The number of episodes in this series */
  readonly episodeCount?: Maybe<Scalars['Int']>;
  /** The general length (in seconds) of each episode */
  readonly episodeLength?: Maybe<Scalars['Int']>;
  /** Episodes for this media */
  readonly episodes: EpisodeConnection;
  /** The number of users with this in their favorites */
  readonly favoritesCount?: Maybe<Scalars['Int']>;
  readonly id: Scalars['ID'];
  /** A list of mappings for this media */
  readonly mappings: MappingConnection;
  /** The time of the next release of this media */
  readonly nextRelease?: Maybe<Scalars['ISO8601DateTime']>;
  /** The poster image of this media */
  readonly posterImage: Image;
  /** The companies which helped to produce this media */
  readonly productions: MediaProductionConnection;
  /** A list of quotes from this media */
  readonly quotes: QuoteConnection;
  /** A list of reactions for this media */
  readonly reactions: MediaReactionConnection;
  /** The season this was released in */
  readonly season?: Maybe<ReleaseSeason>;
  /** Whether the media is Safe-for-Work */
  readonly sfw: Scalars['Boolean'];
  /** The URL-friendly identifier of this media */
  readonly slug: Scalars['String'];
  /** The staff members who worked on this media */
  readonly staff: MediaStaffConnection;
  /** The day that this media first released */
  readonly startDate?: Maybe<Scalars['Date']>;
  /** The current releasing status of this media */
  readonly status: ReleaseStatus;
  /** The stream links. */
  readonly streamingLinks: StreamingLinkConnection;
  /** A secondary type for categorizing Anime. */
  readonly subtype: AnimeSubtype;
  /** Description of when this media is expected to release */
  readonly tba?: Maybe<Scalars['String']>;
  /** The titles for this media in various locales */
  readonly titles: TitlesList;
  /** The total length (in seconds) of the entire series */
  readonly totalLength?: Maybe<Scalars['Int']>;
  /** Anime or Manga. */
  readonly type: Scalars['String'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** The number of users with this in their library */
  readonly userCount?: Maybe<Scalars['Int']>;
  /** Video id for a trailer on YouTube */
  readonly youtubeTrailerVideoId?: Maybe<Scalars['String']>;
};


export type AnimeCategoriesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type AnimeCharactersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type AnimeDescriptionArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};


export type AnimeEpisodesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  number?: Maybe<ReadonlyArray<Scalars['Int']>>;
};


export type AnimeMappingsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type AnimeProductionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type AnimeQuotesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type AnimeReactionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type AnimeStaffArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type AnimeStreamingLinksArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type AnimeAmountConsumed = AmountConsumed & {
  readonly __typename?: 'AnimeAmountConsumed';
  /** Total media completed atleast once. */
  readonly completed: Scalars['Int'];
  readonly id: Scalars['ID'];
  /** Total amount of media. */
  readonly media: Scalars['Int'];
  /** The profile related to the user for this stat. */
  readonly profile: Profile;
  /** Last time we fully recalculated this stat. */
  readonly recalculatedAt: Scalars['ISO8601Date'];
  /** Total time spent in minutes. */
  readonly time: Scalars['Int'];
  /** Total progress of library including reconsuming. */
  readonly units: Scalars['Int'];
};

export type AnimeCategoryBreakdown = CategoryBreakdown & {
  readonly __typename?: 'AnimeCategoryBreakdown';
  /** A Map of category_id -> count for all categories present on the library entries */
  readonly categories: Scalars['Map'];
  readonly id: Scalars['ID'];
  /** The profile related to the user for this stat. */
  readonly profile: Profile;
  /** Last time we fully recalculated this stat. */
  readonly recalculatedAt: Scalars['ISO8601Date'];
  /** The total amount of library entries. */
  readonly total: Scalars['Int'];
};

/** The connection type for Anime. */
export type AnimeConnection = {
  readonly __typename?: 'AnimeConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<AnimeEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Anime>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

export type AnimeCreateInput = {
  readonly titles: TitlesListInput;
  readonly description: Scalars['Map'];
  readonly ageRating?: Maybe<AgeRating>;
  readonly ageRatingGuide?: Maybe<Scalars['String']>;
  readonly tba?: Maybe<Scalars['String']>;
  readonly startDate?: Maybe<Scalars['Date']>;
  readonly endDate?: Maybe<Scalars['Date']>;
  readonly posterImage?: Maybe<Scalars['Upload']>;
  readonly bannerImage?: Maybe<Scalars['Upload']>;
  readonly youtubeTrailerVideoId?: Maybe<Scalars['String']>;
  readonly episodeCount?: Maybe<Scalars['Int']>;
  readonly episodeLength?: Maybe<Scalars['Int']>;
};

/** Autogenerated return type of AnimeCreate */
export type AnimeCreatePayload = {
  readonly __typename?: 'AnimeCreatePayload';
  readonly anime?: Maybe<Anime>;
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
};

/** Autogenerated return type of AnimeDelete */
export type AnimeDeletePayload = {
  readonly __typename?: 'AnimeDeletePayload';
  readonly anime?: Maybe<GenericDelete>;
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
};

/** An edge in a connection. */
export type AnimeEdge = {
  readonly __typename?: 'AnimeEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Anime>;
};

export type AnimeMutation = {
  readonly __typename?: 'AnimeMutation';
  /** Create an Anime. */
  readonly create?: Maybe<AnimeCreatePayload>;
  /** Delete an Anime. */
  readonly delete?: Maybe<AnimeDeletePayload>;
  /** Update an Anime. */
  readonly update?: Maybe<AnimeUpdatePayload>;
};


export type AnimeMutationCreateArgs = {
  input: AnimeCreateInput;
};


export type AnimeMutationDeleteArgs = {
  input: GenericDeleteInput;
};


export type AnimeMutationUpdateArgs = {
  input: AnimeUpdateInput;
};

export type AnimeSubtype = 
  | 'TV'
  /** Spinoffs or Extras of the original. */
  | 'SPECIAL'
  /** Original Video Animation. Anime directly released to video market. */
  | 'OVA'
  /** Original Net Animation (Web Anime). */
  | 'ONA'
  | 'MOVIE'
  | 'MUSIC';

export type AnimeUpdateInput = {
  readonly id: Scalars['ID'];
  readonly titles?: Maybe<TitlesListInput>;
  readonly description?: Maybe<Scalars['Map']>;
  readonly ageRating?: Maybe<AgeRating>;
  readonly ageRatingGuide?: Maybe<Scalars['String']>;
  readonly tba?: Maybe<Scalars['String']>;
  readonly startDate?: Maybe<Scalars['Date']>;
  readonly endDate?: Maybe<Scalars['Date']>;
  readonly posterImage?: Maybe<Scalars['Upload']>;
  readonly bannerImage?: Maybe<Scalars['Upload']>;
  readonly youtubeTrailerVideoId?: Maybe<Scalars['String']>;
  readonly episodeCount?: Maybe<Scalars['Int']>;
  readonly episodeLength?: Maybe<Scalars['Int']>;
};

/** Autogenerated return type of AnimeUpdate */
export type AnimeUpdatePayload = {
  readonly __typename?: 'AnimeUpdatePayload';
  readonly anime?: Maybe<Anime>;
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
};

/** Generic error fields used by all errors. */
export type Base = {
  /** The error code. */
  readonly code?: Maybe<Scalars['String']>;
  /** A description of the error */
  readonly message: Scalars['String'];
  /** Which input value this error came from */
  readonly path?: Maybe<ReadonlyArray<Scalars['String']>>;
};

/** Information about a specific Category */
export type Category = WithTimestamps & {
  readonly __typename?: 'Category';
  /** The child categories. */
  readonly children?: Maybe<CategoryConnection>;
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** A brief summary or description of the catgory. */
  readonly description: Scalars['Map'];
  readonly id: Scalars['ID'];
  /** Whether the category is Not-Safe-for-Work. */
  readonly isNsfw: Scalars['Boolean'];
  /** The parent category. Each category can have one parent. */
  readonly parent?: Maybe<Category>;
  /** The URL-friendly identifier of this Category. */
  readonly slug: Scalars['String'];
  /** The name of the category. */
  readonly title: Scalars['Map'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
};


/** Information about a specific Category */
export type CategoryChildrenArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** Information about a specific Category */
export type CategoryDescriptionArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};


/** Information about a specific Category */
export type CategoryTitleArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};

/** Generic Category Breakdown based on Media */
export type CategoryBreakdown = {
  /** A Map of category_id -> count for all categories present on the library entries */
  readonly categories: Scalars['Map'];
  readonly id: Scalars['ID'];
  /** The profile related to the user for this stat. */
  readonly profile: Profile;
  /** Last time we fully recalculated this stat. */
  readonly recalculatedAt: Scalars['ISO8601Date'];
  /** The total amount of library entries. */
  readonly total: Scalars['Int'];
};

/** The connection type for Category. */
export type CategoryConnection = {
  readonly __typename?: 'CategoryConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<CategoryEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Category>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type CategoryEdge = {
  readonly __typename?: 'CategoryEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Category>;
};

/** A single chapter of a manga */
export type Chapter = Unit & WithTimestamps & {
  readonly __typename?: 'Chapter';
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** A brief summary or description of the unit */
  readonly description: Scalars['Map'];
  readonly id: Scalars['ID'];
  /** The manga this chapter is in. */
  readonly manga: Manga;
  /** The sequence number of this unit */
  readonly number: Scalars['Int'];
  /** When this chapter was released */
  readonly releasedAt?: Maybe<Scalars['ISO8601Date']>;
  /** A thumbnail image for the unit */
  readonly thumbnail?: Maybe<Image>;
  /** The titles for this unit in various locales */
  readonly titles: TitlesList;
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** The volume this chapter is in. */
  readonly volume?: Maybe<Volume>;
};


/** A single chapter of a manga */
export type ChapterDescriptionArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};

/** The connection type for Chapter. */
export type ChapterConnection = {
  readonly __typename?: 'ChapterConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<ChapterEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Chapter>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ChapterEdge = {
  readonly __typename?: 'ChapterEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Chapter>;
};

/** Information about a Character in the Kitsu database */
export type Character = WithTimestamps & {
  readonly __typename?: 'Character';
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** A brief summary or description of the character. */
  readonly description: Scalars['Map'];
  readonly id: Scalars['ID'];
  /** An image of the character */
  readonly image?: Maybe<Image>;
  /** Media this character appears in. */
  readonly media?: Maybe<MediaCharacterConnection>;
  /** The name for this character in various locales */
  readonly names?: Maybe<TitlesList>;
  /** The original media this character showed up in */
  readonly primaryMedia?: Maybe<Media>;
  /** The URL-friendly identifier of this character */
  readonly slug: Scalars['String'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
};


/** Information about a Character in the Kitsu database */
export type CharacterDescriptionArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};


/** Information about a Character in the Kitsu database */
export type CharacterMediaArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type CharacterRole = 
  /** A character who appears throughout a series and is a focal point of the media */
  | 'MAIN'
  /** A character who appears in multiple episodes but is not a main character */
  | 'RECURRING'
  /** A background character who generally only appears in a few episodes */
  | 'BACKGROUND'
  /** A character from a different franchise making a (usually brief) appearance */
  | 'CAMEO';

/** Information about a VA (Person) voicing a Character in a Media */
export type CharacterVoice = WithTimestamps & {
  readonly __typename?: 'CharacterVoice';
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The company who hired this voice actor to play this role */
  readonly licensor?: Maybe<Producer>;
  /** The BCP47 locale tag for the voice acting role */
  readonly locale: Scalars['String'];
  /** The MediaCharacter node */
  readonly mediaCharacter: MediaCharacter;
  /** The person who voice acted this role */
  readonly person: Person;
  readonly updatedAt: Scalars['ISO8601DateTime'];
};

/** The connection type for CharacterVoice. */
export type CharacterVoiceConnection = {
  readonly __typename?: 'CharacterVoiceConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<CharacterVoiceEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<CharacterVoice>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type CharacterVoiceEdge = {
  readonly __typename?: 'CharacterVoiceEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<CharacterVoice>;
};

/** A comment on a post */
export type Comment = WithTimestamps & {
  readonly __typename?: 'Comment';
  /** The user who created this comment for the parent post. */
  readonly author: Profile;
  /** Unmodified content. */
  readonly content: Scalars['String'];
  /** Html formatted content. */
  readonly contentFormatted: Scalars['String'];
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** Users who liked this comment. */
  readonly likes: ProfileConnection;
  /** The parent comment if this comment was a reply to another. */
  readonly parent?: Maybe<Comment>;
  /** The post that this comment is attached to. */
  readonly post: Post;
  /** All replies to a specific comment. */
  readonly replies: CommentConnection;
  readonly updatedAt: Scalars['ISO8601DateTime'];
};


/** A comment on a post */
export type CommentLikesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A comment on a post */
export type CommentRepliesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** The connection type for Comment. */
export type CommentConnection = {
  readonly __typename?: 'CommentConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<CommentEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Comment>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type CommentEdge = {
  readonly __typename?: 'CommentEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Comment>;
};


/** An Episode of a Media */
export type Episode = Unit & WithTimestamps & {
  readonly __typename?: 'Episode';
  /** The anime this episode is in */
  readonly anime: Anime;
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** A brief summary or description of the unit */
  readonly description: Scalars['Map'];
  readonly id: Scalars['ID'];
  /** The length of the episode in seconds */
  readonly length?: Maybe<Scalars['Int']>;
  /** The sequence number of this unit */
  readonly number: Scalars['Int'];
  /** When this episode aired */
  readonly releasedAt?: Maybe<Scalars['ISO8601DateTime']>;
  /** A thumbnail image for the unit */
  readonly thumbnail?: Maybe<Image>;
  /** The titles for this unit in various locales */
  readonly titles: TitlesList;
  readonly updatedAt: Scalars['ISO8601DateTime'];
};


/** An Episode of a Media */
export type EpisodeDescriptionArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};

/** The connection type for Episode. */
export type EpisodeConnection = {
  readonly __typename?: 'EpisodeConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<EpisodeEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Episode>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

export type EpisodeCreateInput = {
  readonly mediaId: Scalars['ID'];
  readonly mediaType: Media_Type;
  readonly titles: TitlesListInput;
  readonly number: Scalars['Int'];
  readonly description?: Maybe<Scalars['Map']>;
  readonly length?: Maybe<Scalars['Int']>;
  readonly releasedAt?: Maybe<Scalars['Date']>;
  readonly thumbnailImage?: Maybe<Scalars['Upload']>;
};

/** Autogenerated return type of EpisodeCreate */
export type EpisodeCreatePayload = {
  readonly __typename?: 'EpisodeCreatePayload';
  readonly episode?: Maybe<Episode>;
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
};

/** Autogenerated return type of EpisodeDelete */
export type EpisodeDeletePayload = {
  readonly __typename?: 'EpisodeDeletePayload';
  readonly episode?: Maybe<GenericDelete>;
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
};

/** An edge in a connection. */
export type EpisodeEdge = {
  readonly __typename?: 'EpisodeEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Episode>;
};

export type EpisodeMutation = {
  readonly __typename?: 'EpisodeMutation';
  /** Create an Episode. */
  readonly create?: Maybe<EpisodeCreatePayload>;
  /** Delete an Episode. */
  readonly delete?: Maybe<EpisodeDeletePayload>;
  /** Update an Episode. */
  readonly update?: Maybe<EpisodeUpdatePayload>;
};


export type EpisodeMutationCreateArgs = {
  input: EpisodeCreateInput;
};


export type EpisodeMutationDeleteArgs = {
  input: GenericDeleteInput;
};


export type EpisodeMutationUpdateArgs = {
  input: EpisodeUpdateInput;
};

export type EpisodeUpdateInput = {
  readonly id: Scalars['ID'];
  readonly titles?: Maybe<TitlesListInput>;
  readonly number?: Maybe<Scalars['Int']>;
  readonly description?: Maybe<Scalars['Map']>;
  readonly length?: Maybe<Scalars['Int']>;
  readonly releasedAt?: Maybe<Scalars['Date']>;
  readonly thumbnailImage?: Maybe<Scalars['Upload']>;
};

/** Autogenerated return type of EpisodeUpdate */
export type EpisodeUpdatePayload = {
  readonly __typename?: 'EpisodeUpdatePayload';
  readonly episode?: Maybe<Episode>;
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
};

/** An episodic media in the Kitsu database */
export type Episodic = {
  /** The number of episodes in this series */
  readonly episodeCount?: Maybe<Scalars['Int']>;
  /** The general length (in seconds) of each episode */
  readonly episodeLength?: Maybe<Scalars['Int']>;
  /** Episodes for this media */
  readonly episodes: EpisodeConnection;
  /** The total length (in seconds) of the entire series */
  readonly totalLength?: Maybe<Scalars['Int']>;
};


/** An episodic media in the Kitsu database */
export type EpisodicEpisodesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  number?: Maybe<ReadonlyArray<Scalars['Int']>>;
};

/** Favorite media, characters, and people for a user */
export type Favorite = WithTimestamps & {
  readonly __typename?: 'Favorite';
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The kitsu object that is mapped */
  readonly item: FavoriteItem;
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** The user who favorited this item */
  readonly user: Profile;
};

/** The connection type for Favorite. */
export type FavoriteConnection = {
  readonly __typename?: 'FavoriteConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<FavoriteEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Favorite>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type FavoriteEdge = {
  readonly __typename?: 'FavoriteEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Favorite>;
};

/** Objects which are Favoritable */
export type FavoriteItem = Anime | Character | Manga | Person;

export type Generic = Base & {
  readonly __typename?: 'Generic';
  /** The error code. */
  readonly code?: Maybe<Scalars['String']>;
  /** A description of the error */
  readonly message: Scalars['String'];
  /** Which input value this error came from */
  readonly path?: Maybe<ReadonlyArray<Scalars['String']>>;
};

export type GenericDelete = {
  readonly __typename?: 'GenericDelete';
  readonly id: Scalars['ID'];
};

export type GenericDeleteInput = {
  readonly id: Scalars['ID'];
};



export type Image = {
  readonly __typename?: 'Image';
  /** A blurhash-encoded version of this image */
  readonly blurhash?: Maybe<Scalars['String']>;
  /** The original image */
  readonly original: ImageView;
  /** The various generated views of this image */
  readonly views: ReadonlyArray<ImageView>;
};


export type ImageViewsArgs = {
  names?: Maybe<ReadonlyArray<Scalars['String']>>;
};

export type ImageView = WithTimestamps & {
  readonly __typename?: 'ImageView';
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** The height of the image */
  readonly height?: Maybe<Scalars['Int']>;
  /** The name of this view of the image */
  readonly name: Scalars['String'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** The URL of this view of the image */
  readonly url: Scalars['String'];
  /** The width of the image */
  readonly width?: Maybe<Scalars['Int']>;
};

/** The user library filterable by media_type and status */
export type Library = {
  readonly __typename?: 'Library';
  /** All Library Entries for a specific Media */
  readonly all: LibraryEntryConnection;
  /** Library Entries for a specific Media filtered by the completed status */
  readonly completed: LibraryEntryConnection;
  /** Library Entries for a specific Media filtered by the current status */
  readonly current: LibraryEntryConnection;
  /** Library Entries for a specific Media filtered by the dropped status */
  readonly dropped: LibraryEntryConnection;
  /** Library Entries for a specific Media filtered by the on_hold status */
  readonly onHold: LibraryEntryConnection;
  /** Library Entries for a specific Media filtered by the planned status */
  readonly planned: LibraryEntryConnection;
};


/** The user library filterable by media_type and status */
export type LibraryAllArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  mediaType: Media_Type;
  status?: Maybe<ReadonlyArray<LibraryEntryStatus>>;
};


/** The user library filterable by media_type and status */
export type LibraryCompletedArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  mediaType: Media_Type;
};


/** The user library filterable by media_type and status */
export type LibraryCurrentArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  mediaType: Media_Type;
};


/** The user library filterable by media_type and status */
export type LibraryDroppedArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  mediaType: Media_Type;
};


/** The user library filterable by media_type and status */
export type LibraryOnHoldArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  mediaType: Media_Type;
};


/** The user library filterable by media_type and status */
export type LibraryPlannedArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  mediaType: Media_Type;
};

/** Information about a specific media entry for a user */
export type LibraryEntry = WithTimestamps & {
  readonly __typename?: 'LibraryEntry';
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** History of user actions for this library entry. */
  readonly events?: Maybe<LibraryEventConnection>;
  /** When the user finished this media. */
  readonly finishedAt?: Maybe<Scalars['ISO8601DateTime']>;
  readonly id: Scalars['ID'];
  /** The last unit consumed */
  readonly lastUnit?: Maybe<Unit>;
  /** The media related to this library entry. */
  readonly media: Media;
  /** The next unit to be consumed */
  readonly nextUnit?: Maybe<Unit>;
  /** Notes left by the profile related to this library entry. */
  readonly notes?: Maybe<Scalars['String']>;
  /** If the media related to the library entry is Not-Safe-for-Work. */
  readonly nsfw: Scalars['Boolean'];
  /** If this library entry is publicly visibile from their profile, or hidden. */
  readonly private: Scalars['Boolean'];
  /** The number of episodes/chapters this user has watched/read */
  readonly progress: Scalars['Int'];
  /** When the user last watched an episode or read a chapter of this media. */
  readonly progressedAt?: Maybe<Scalars['ISO8601DateTime']>;
  /** How much you enjoyed this media (lower meaning not liking). */
  readonly rating?: Maybe<Scalars['Int']>;
  /** The reaction based on the media of this library entry. */
  readonly reaction?: Maybe<MediaReaction>;
  /** Amount of times this media has been rewatched. */
  readonly reconsumeCount: Scalars['Int'];
  /** If the profile is currently rewatching this media. */
  readonly reconsuming: Scalars['Boolean'];
  /** When the user started this media. */
  readonly startedAt?: Maybe<Scalars['ISO8601DateTime']>;
  readonly status: LibraryEntryStatus;
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** The user who created this library entry. */
  readonly user: Profile;
  /** Volumes that the profile owns (physically or digital). */
  readonly volumesOwned: Scalars['Int'];
};


/** Information about a specific media entry for a user */
export type LibraryEntryEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  mediaTypes?: Maybe<ReadonlyArray<Media_Type>>;
};

/** The connection type for LibraryEntry. */
export type LibraryEntryConnection = {
  readonly __typename?: 'LibraryEntryConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<LibraryEntryEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<LibraryEntry>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

export type LibraryEntryCreateInput = {
  readonly userId: Scalars['ID'];
  readonly mediaId: Scalars['ID'];
  readonly mediaType: Media_Type;
  readonly status: LibraryEntryStatus;
  readonly progress?: Maybe<Scalars['Int']>;
  readonly private?: Maybe<Scalars['Boolean']>;
  readonly notes?: Maybe<Scalars['String']>;
  readonly reconsumeCount?: Maybe<Scalars['Int']>;
  readonly reconsuming?: Maybe<Scalars['Boolean']>;
  readonly volumesOwned?: Maybe<Scalars['Int']>;
  readonly rating?: Maybe<Scalars['Int']>;
  readonly startedAt?: Maybe<Scalars['ISO8601DateTime']>;
  readonly finishedAt?: Maybe<Scalars['ISO8601DateTime']>;
};

/** Autogenerated return type of LibraryEntryCreate */
export type LibraryEntryCreatePayload = {
  readonly __typename?: 'LibraryEntryCreatePayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly libraryEntry?: Maybe<LibraryEntry>;
};

/** Autogenerated return type of LibraryEntryDelete */
export type LibraryEntryDeletePayload = {
  readonly __typename?: 'LibraryEntryDeletePayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly libraryEntry?: Maybe<GenericDelete>;
};

/** An edge in a connection. */
export type LibraryEntryEdge = {
  readonly __typename?: 'LibraryEntryEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<LibraryEntry>;
};

export type LibraryEntryMutation = {
  readonly __typename?: 'LibraryEntryMutation';
  /** Create a library entry */
  readonly create?: Maybe<LibraryEntryCreatePayload>;
  /** Delete a library entry */
  readonly delete?: Maybe<LibraryEntryDeletePayload>;
  /** Update a library entry */
  readonly update?: Maybe<LibraryEntryUpdatePayload>;
  /** Update library entry progress by id */
  readonly updateProgressById?: Maybe<LibraryEntryUpdateProgressByIdPayload>;
  /** Update library entry progress by media */
  readonly updateProgressByMedia?: Maybe<LibraryEntryUpdateProgressByMediaPayload>;
  /** Update library entry rating by id */
  readonly updateRatingById?: Maybe<LibraryEntryUpdateRatingByIdPayload>;
  /** Update library entry rating by media */
  readonly updateRatingByMedia?: Maybe<LibraryEntryUpdateRatingByMediaPayload>;
  /** Update library entry status by id */
  readonly updateStatusById?: Maybe<LibraryEntryUpdateStatusByIdPayload>;
  /** Update library entry status by media */
  readonly updateStatusByMedia?: Maybe<LibraryEntryUpdateStatusByMediaPayload>;
};


export type LibraryEntryMutationCreateArgs = {
  input: LibraryEntryCreateInput;
};


export type LibraryEntryMutationDeleteArgs = {
  input: GenericDeleteInput;
};


export type LibraryEntryMutationUpdateArgs = {
  input: LibraryEntryUpdateInput;
};


export type LibraryEntryMutationUpdateProgressByIdArgs = {
  input: UpdateProgressByIdInput;
};


export type LibraryEntryMutationUpdateProgressByMediaArgs = {
  input: UpdateProgressByMediaInput;
};


export type LibraryEntryMutationUpdateRatingByIdArgs = {
  input: UpdateRatingByIdInput;
};


export type LibraryEntryMutationUpdateRatingByMediaArgs = {
  input: UpdateRatingByMediaInput;
};


export type LibraryEntryMutationUpdateStatusByIdArgs = {
  input: UpdateStatusByIdInput;
};


export type LibraryEntryMutationUpdateStatusByMediaArgs = {
  input: UpdateStatusByMediaInput;
};

export type LibraryEntryStatus = 
  /** The user is currently reading or watching this media. */
  | 'CURRENT'
  /** The user plans to read or watch this media in future. */
  | 'PLANNED'
  /** The user completed this media. */
  | 'COMPLETED'
  /** The user started but paused reading or watching this media. */
  | 'ON_HOLD'
  /** The user started but chose not to finish this media. */
  | 'DROPPED';

export type LibraryEntryUpdateInput = {
  readonly id: Scalars['ID'];
  readonly status?: Maybe<LibraryEntryStatus>;
  readonly progress?: Maybe<Scalars['Int']>;
  readonly private?: Maybe<Scalars['Boolean']>;
  readonly notes?: Maybe<Scalars['String']>;
  readonly reconsumeCount?: Maybe<Scalars['Int']>;
  readonly reconsuming?: Maybe<Scalars['Boolean']>;
  readonly volumesOwned?: Maybe<Scalars['Int']>;
  readonly rating?: Maybe<Scalars['Int']>;
  readonly startedAt?: Maybe<Scalars['ISO8601DateTime']>;
  readonly finishedAt?: Maybe<Scalars['ISO8601DateTime']>;
};

/** Autogenerated return type of LibraryEntryUpdate */
export type LibraryEntryUpdatePayload = {
  readonly __typename?: 'LibraryEntryUpdatePayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly libraryEntry?: Maybe<LibraryEntry>;
};

/** Autogenerated return type of LibraryEntryUpdateProgressById */
export type LibraryEntryUpdateProgressByIdPayload = {
  readonly __typename?: 'LibraryEntryUpdateProgressByIdPayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly libraryEntry?: Maybe<LibraryEntry>;
};

/** Autogenerated return type of LibraryEntryUpdateProgressByMedia */
export type LibraryEntryUpdateProgressByMediaPayload = {
  readonly __typename?: 'LibraryEntryUpdateProgressByMediaPayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly libraryEntry?: Maybe<LibraryEntry>;
};

/** Autogenerated return type of LibraryEntryUpdateRatingById */
export type LibraryEntryUpdateRatingByIdPayload = {
  readonly __typename?: 'LibraryEntryUpdateRatingByIdPayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly libraryEntry?: Maybe<LibraryEntry>;
};

/** Autogenerated return type of LibraryEntryUpdateRatingByMedia */
export type LibraryEntryUpdateRatingByMediaPayload = {
  readonly __typename?: 'LibraryEntryUpdateRatingByMediaPayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly libraryEntry?: Maybe<LibraryEntry>;
};

/** Autogenerated return type of LibraryEntryUpdateStatusById */
export type LibraryEntryUpdateStatusByIdPayload = {
  readonly __typename?: 'LibraryEntryUpdateStatusByIdPayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly libraryEntry?: Maybe<LibraryEntry>;
};

/** Autogenerated return type of LibraryEntryUpdateStatusByMedia */
export type LibraryEntryUpdateStatusByMediaPayload = {
  readonly __typename?: 'LibraryEntryUpdateStatusByMediaPayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly libraryEntry?: Maybe<LibraryEntry>;
};

/** History of user actions for a library entry. */
export type LibraryEvent = WithTimestamps & {
  readonly __typename?: 'LibraryEvent';
  /** The data that was changed for this library event. */
  readonly changedData: Scalars['Map'];
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The type of library event. */
  readonly kind: LibraryEventKind;
  /** The library entry related to this library event. */
  readonly libraryEntry: LibraryEntry;
  /** The media related to this library event. */
  readonly media: Media;
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** The user who created this library event */
  readonly user: Profile;
};

/** The connection type for LibraryEvent. */
export type LibraryEventConnection = {
  readonly __typename?: 'LibraryEventConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<LibraryEventEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<LibraryEvent>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type LibraryEventEdge = {
  readonly __typename?: 'LibraryEventEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<LibraryEvent>;
};

export type LibraryEventKind = 
  /** Progress or Time Spent was added/updated. */
  | 'PROGRESSED'
  /** Status or Reconsuming was added/updated. */
  | 'UPDATED'
  /** Reaction was added/updated. */
  | 'REACTED'
  /** Rating was added/updated. */
  | 'RATED'
  /** Notes were added/updated. */
  | 'ANNOTATED';

export type Manga = Media & WithTimestamps & {
  readonly __typename?: 'Manga';
  /** The recommended minimum age group for this media */
  readonly ageRating?: Maybe<AgeRating>;
  /** An explanation of why this received the age rating it did */
  readonly ageRatingGuide?: Maybe<Scalars['String']>;
  /** The average rating of this media amongst all Kitsu users */
  readonly averageRating?: Maybe<Scalars['Float']>;
  /** A large banner image for this media */
  readonly bannerImage: Image;
  /** A list of categories for this media */
  readonly categories: CategoryConnection;
  /** The number of chapters in this manga. */
  readonly chapterCount?: Maybe<Scalars['Int']>;
  /** The estimated number of chapters in this manga. */
  readonly chapterCountGuess?: Maybe<Scalars['Int']>;
  /** The chapters in the manga. */
  readonly chapters?: Maybe<ChapterConnection>;
  /** The characters who starred in this media */
  readonly characters: MediaCharacterConnection;
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** A brief (mostly spoiler free) summary or description of the media. */
  readonly description: Scalars['Map'];
  /** the day that this media made its final release */
  readonly endDate?: Maybe<Scalars['Date']>;
  /** The number of users with this in their favorites */
  readonly favoritesCount?: Maybe<Scalars['Int']>;
  readonly id: Scalars['ID'];
  /** A list of mappings for this media */
  readonly mappings: MappingConnection;
  /** The time of the next release of this media */
  readonly nextRelease?: Maybe<Scalars['ISO8601DateTime']>;
  /** The poster image of this media */
  readonly posterImage: Image;
  /** The companies which helped to produce this media */
  readonly productions: MediaProductionConnection;
  /** A list of quotes from this media */
  readonly quotes: QuoteConnection;
  /** A list of reactions for this media */
  readonly reactions: MediaReactionConnection;
  /** The season this was released in */
  readonly season?: Maybe<ReleaseSeason>;
  /** Whether the media is Safe-for-Work */
  readonly sfw: Scalars['Boolean'];
  /** The URL-friendly identifier of this media */
  readonly slug: Scalars['String'];
  /** The staff members who worked on this media */
  readonly staff: MediaStaffConnection;
  /** The day that this media first released */
  readonly startDate?: Maybe<Scalars['Date']>;
  /** The current releasing status of this media */
  readonly status: ReleaseStatus;
  /** A secondary type for categorizing Manga. */
  readonly subtype: MangaSubtype;
  /** Description of when this media is expected to release */
  readonly tba?: Maybe<Scalars['String']>;
  /** The titles for this media in various locales */
  readonly titles: TitlesList;
  /** Anime or Manga. */
  readonly type: Scalars['String'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** The number of users with this in their library */
  readonly userCount?: Maybe<Scalars['Int']>;
  /** The number of volumes in this manga. */
  readonly volumeCount?: Maybe<Scalars['Int']>;
};


export type MangaCategoriesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type MangaChaptersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type MangaCharactersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type MangaDescriptionArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};


export type MangaMappingsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type MangaProductionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type MangaQuotesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type MangaReactionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type MangaStaffArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type MangaAmountConsumed = AmountConsumed & {
  readonly __typename?: 'MangaAmountConsumed';
  /** Total media completed atleast once. */
  readonly completed: Scalars['Int'];
  readonly id: Scalars['ID'];
  /** Total amount of media. */
  readonly media: Scalars['Int'];
  /** The profile related to the user for this stat. */
  readonly profile: Profile;
  /** Last time we fully recalculated this stat. */
  readonly recalculatedAt: Scalars['ISO8601Date'];
  /** Total progress of library including reconsuming. */
  readonly units: Scalars['Int'];
};

export type MangaCategoryBreakdown = CategoryBreakdown & {
  readonly __typename?: 'MangaCategoryBreakdown';
  /** A Map of category_id -> count for all categories present on the library entries */
  readonly categories: Scalars['Map'];
  readonly id: Scalars['ID'];
  /** The profile related to the user for this stat. */
  readonly profile: Profile;
  /** Last time we fully recalculated this stat. */
  readonly recalculatedAt: Scalars['ISO8601Date'];
  /** The total amount of library entries. */
  readonly total: Scalars['Int'];
};

/** The connection type for Manga. */
export type MangaConnection = {
  readonly __typename?: 'MangaConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<MangaEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Manga>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type MangaEdge = {
  readonly __typename?: 'MangaEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Manga>;
};

export type MangaSubtype = 
  | 'MANGA'
  | 'NOVEL'
  /** Chinese comics produced in China and in the Greater China region. */
  | 'MANHUA'
  | 'ONESHOT'
  /** Self published work. */
  | 'DOUJIN'
  /** A style of South Korean comic books and graphic novels */
  | 'MANHWA'
  /** Original English Language. */
  | 'OEL';


/** Media Mappings from External Sites (MAL, Anilist, etc..) to Kitsu. */
export type Mapping = WithTimestamps & {
  readonly __typename?: 'Mapping';
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** The ID of the media from the external site. */
  readonly externalId: Scalars['ID'];
  /** The name of the site which kitsu media is being linked from. */
  readonly externalSite: MappingExternalSite;
  readonly id: Scalars['ID'];
  /** The kitsu object that is mapped. */
  readonly item: MappingItem;
  readonly updatedAt: Scalars['ISO8601DateTime'];
};

/** The connection type for Mapping. */
export type MappingConnection = {
  readonly __typename?: 'MappingConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<MappingEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Mapping>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type MappingEdge = {
  readonly __typename?: 'MappingEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Mapping>;
};

export type MappingExternalSite = 
  | 'MYANIMELIST_ANIME'
  | 'MYANIMELIST_MANGA'
  | 'MYANIMELIST_CHARACTERS'
  | 'MYANIMELIST_PEOPLE'
  | 'MYANIMELIST_PRODUCERS'
  | 'ANILIST_ANIME'
  | 'ANILIST_MANGA'
  | 'THETVDB'
  | 'THETVDB_SERIES'
  | 'THETVDB_SEASON'
  | 'ANIDB'
  | 'ANIMENEWSNETWORK'
  | 'MANGAUPDATES'
  | 'HULU'
  | 'IMDB_EPISODES'
  | 'AOZORA'
  | 'TRAKT'
  | 'MYDRAMALIST';

/** Objects which are Mappable */
export type MappingItem = Anime | Category | Character | Episode | Manga | Person | Producer;

/** A media in the Kitsu database */
export type Media = {
  /** The recommended minimum age group for this media */
  readonly ageRating?: Maybe<AgeRating>;
  /** An explanation of why this received the age rating it did */
  readonly ageRatingGuide?: Maybe<Scalars['String']>;
  /** The average rating of this media amongst all Kitsu users */
  readonly averageRating?: Maybe<Scalars['Float']>;
  /** A large banner image for this media */
  readonly bannerImage: Image;
  /** A list of categories for this media */
  readonly categories: CategoryConnection;
  /** The characters who starred in this media */
  readonly characters: MediaCharacterConnection;
  /** A brief (mostly spoiler free) summary or description of the media. */
  readonly description: Scalars['Map'];
  /** the day that this media made its final release */
  readonly endDate?: Maybe<Scalars['Date']>;
  /** The number of users with this in their favorites */
  readonly favoritesCount?: Maybe<Scalars['Int']>;
  readonly id: Scalars['ID'];
  /** A list of mappings for this media */
  readonly mappings: MappingConnection;
  /** The time of the next release of this media */
  readonly nextRelease?: Maybe<Scalars['ISO8601DateTime']>;
  /** The poster image of this media */
  readonly posterImage: Image;
  /** The companies which helped to produce this media */
  readonly productions: MediaProductionConnection;
  /** A list of quotes from this media */
  readonly quotes: QuoteConnection;
  /** A list of reactions for this media */
  readonly reactions: MediaReactionConnection;
  /** The season this was released in */
  readonly season?: Maybe<ReleaseSeason>;
  /** Whether the media is Safe-for-Work */
  readonly sfw: Scalars['Boolean'];
  /** The URL-friendly identifier of this media */
  readonly slug: Scalars['String'];
  /** The staff members who worked on this media */
  readonly staff: MediaStaffConnection;
  /** The day that this media first released */
  readonly startDate?: Maybe<Scalars['Date']>;
  /** The current releasing status of this media */
  readonly status: ReleaseStatus;
  /** Description of when this media is expected to release */
  readonly tba?: Maybe<Scalars['String']>;
  /** The titles for this media in various locales */
  readonly titles: TitlesList;
  /** Anime or Manga. */
  readonly type: Scalars['String'];
  /** The number of users with this in their library */
  readonly userCount?: Maybe<Scalars['Int']>;
};


/** A media in the Kitsu database */
export type MediaCategoriesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A media in the Kitsu database */
export type MediaCharactersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A media in the Kitsu database */
export type MediaDescriptionArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};


/** A media in the Kitsu database */
export type MediaMappingsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A media in the Kitsu database */
export type MediaProductionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A media in the Kitsu database */
export type MediaQuotesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A media in the Kitsu database */
export type MediaReactionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A media in the Kitsu database */
export type MediaStaffArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** Information about a Character starring in a Media */
export type MediaCharacter = WithTimestamps & {
  readonly __typename?: 'MediaCharacter';
  /** The character */
  readonly character: Character;
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The media */
  readonly media: Media;
  /** The role this character had in the media */
  readonly role: CharacterRole;
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** The voices of this character */
  readonly voices?: Maybe<CharacterVoiceConnection>;
};


/** Information about a Character starring in a Media */
export type MediaCharacterVoicesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  locale?: Maybe<ReadonlyArray<Scalars['String']>>;
};

/** The connection type for MediaCharacter. */
export type MediaCharacterConnection = {
  readonly __typename?: 'MediaCharacterConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<MediaCharacterEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<MediaCharacter>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type MediaCharacterEdge = {
  readonly __typename?: 'MediaCharacterEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<MediaCharacter>;
};

/** The connection type for Media. */
export type MediaConnection = {
  readonly __typename?: 'MediaConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<MediaEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Media>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MediaEdge = {
  readonly __typename?: 'MediaEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Media>;
};

/** The role a company played in the creation or localization of a media */
export type MediaProduction = WithTimestamps & {
  readonly __typename?: 'MediaProduction';
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The media */
  readonly media: Media;
  /** The producer */
  readonly person: Producer;
  /** The role this company played */
  readonly role: Scalars['String'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
};

/** The connection type for MediaProduction. */
export type MediaProductionConnection = {
  readonly __typename?: 'MediaProductionConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<MediaProductionEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<MediaProduction>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type MediaProductionEdge = {
  readonly __typename?: 'MediaProductionEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<MediaProduction>;
};

/** A simple review that is 140 characters long expressing how you felt about a media */
export type MediaReaction = WithTimestamps & {
  readonly __typename?: 'MediaReaction';
  /** The author who wrote this reaction. */
  readonly author: Profile;
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The library entry related to this reaction. */
  readonly libraryEntry: LibraryEntry;
  /** Users who liked this reaction. */
  readonly likes: ProfileConnection;
  /** The media related to this reaction. */
  readonly media: Media;
  /** When this media reaction was written based on media progress. */
  readonly progress: Scalars['Int'];
  /** The reaction text related to a media. */
  readonly reaction: Scalars['String'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
};


/** A simple review that is 140 characters long expressing how you felt about a media */
export type MediaReactionLikesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** The connection type for MediaReaction. */
export type MediaReactionConnection = {
  readonly __typename?: 'MediaReactionConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<MediaReactionEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<MediaReaction>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type MediaReactionEdge = {
  readonly __typename?: 'MediaReactionEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<MediaReaction>;
};

/** Information about a person working on an anime */
export type MediaStaff = WithTimestamps & {
  readonly __typename?: 'MediaStaff';
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The media */
  readonly media: Media;
  /** The person */
  readonly person: Person;
  /** The role this person had in the creation of this media */
  readonly role: Scalars['String'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
};

/** The connection type for MediaStaff. */
export type MediaStaffConnection = {
  readonly __typename?: 'MediaStaffConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<MediaStaffEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<MediaStaff>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type MediaStaffEdge = {
  readonly __typename?: 'MediaStaffEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<MediaStaff>;
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly anime?: Maybe<AnimeMutation>;
  readonly episode?: Maybe<EpisodeMutation>;
  readonly libraryEntry?: Maybe<LibraryEntryMutation>;
  readonly pro: ProMutation;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  readonly __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  readonly endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  readonly hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  readonly hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  readonly startCursor?: Maybe<Scalars['String']>;
};

/** A Voice Actor, Director, Animator, or other person who works in the creation and localization of media */
export type Person = WithTimestamps & {
  readonly __typename?: 'Person';
  /** The day when this person was born */
  readonly birthday?: Maybe<Scalars['Date']>;
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** A brief biography or description of the person. */
  readonly description: Scalars['Map'];
  readonly id: Scalars['ID'];
  /** An image of the person */
  readonly image?: Maybe<Image>;
  /** Information about the person working on specific media */
  readonly mediaStaff?: Maybe<MediaStaffConnection>;
  /** The primary name of this person. */
  readonly name: Scalars['String'];
  /** The name of this person in various languages */
  readonly names: TitlesList;
  /** The URL-friendly identifier of this person. */
  readonly slug: Scalars['String'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** The voice-acting roles this person has had. */
  readonly voices?: Maybe<CharacterVoiceConnection>;
};


/** A Voice Actor, Director, Animator, or other person who works in the creation and localization of media */
export type PersonDescriptionArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};


/** A Voice Actor, Director, Animator, or other person who works in the creation and localization of media */
export type PersonMediaStaffArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A Voice Actor, Director, Animator, or other person who works in the creation and localization of media */
export type PersonVoicesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A post that is visible to your followers and globally in the news-feed. */
export type Post = WithTimestamps & {
  readonly __typename?: 'Post';
  /** The user who created this post. */
  readonly author: Profile;
  /** All comments related to this post. */
  readonly comments: CommentConnection;
  /** Unmodified content. */
  readonly content: Scalars['String'];
  /** Html formatted content. */
  readonly contentFormatted: Scalars['String'];
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** Users that are watching this post */
  readonly follows: ProfileConnection;
  readonly id: Scalars['ID'];
  /** If a post is Not-Safe-for-Work. */
  readonly isNsfw: Scalars['Boolean'];
  /** If this post spoils the tagged media. */
  readonly isSpoiler: Scalars['Boolean'];
  /** Users that have liked this post. */
  readonly likes: ProfileConnection;
  /** The media tagged in this post. */
  readonly media?: Maybe<Media>;
  readonly updatedAt: Scalars['ISO8601DateTime'];
};


/** A post that is visible to your followers and globally in the news-feed. */
export type PostCommentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A post that is visible to your followers and globally in the news-feed. */
export type PostFollowsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A post that is visible to your followers and globally in the news-feed. */
export type PostLikesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** The connection type for Post. */
export type PostConnection = {
  readonly __typename?: 'PostConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<PostEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Post>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type PostEdge = {
  readonly __typename?: 'PostEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Post>;
};

export type ProMutation = {
  readonly __typename?: 'ProMutation';
  /** Set the user's discord tag */
  readonly setDiscord?: Maybe<SetDiscordPayload>;
  /** Set the user's Hall-of-Fame message */
  readonly setMessage?: Maybe<SetMessagePayload>;
  /** End the user's pro subscription */
  readonly unsubscribe?: Maybe<UnsubscribePayload>;
};


export type ProMutationSetDiscordArgs = {
  discord: Scalars['String'];
};


export type ProMutationSetMessageArgs = {
  message: Scalars['String'];
};

/** A subscription to Kitsu PRO */
export type ProSubscription = WithTimestamps & {
  readonly __typename?: 'ProSubscription';
  /** The account which is subscribed to Pro benefits */
  readonly account: Account;
  /** The billing service used for this subscription */
  readonly billingService: RecurringBillingService;
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** The tier of Pro the account is subscribed to */
  readonly tier: ProTier;
  readonly updatedAt: Scalars['ISO8601DateTime'];
};

export type ProTier = 
  /** Aozora Pro (only hides ads) */
  | 'AO_PRO'
  /** Aozora Pro+ (only hides ads) */
  | 'AO_PRO_PLUS'
  /** Basic tier of Kitsu Pro */
  | 'PRO'
  /** Top tier of Kitsu Pro */
  | 'PATRON';

/** A company involved in the creation or localization of media */
export type Producer = WithTimestamps & {
  readonly __typename?: 'Producer';
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The name of this production company */
  readonly name: Scalars['String'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
};

/** A user profile on Kitsu */
export type Profile = WithTimestamps & {
  readonly __typename?: 'Profile';
  /** A short biographical blurb about this profile */
  readonly about?: Maybe<Scalars['String']>;
  /** An avatar image to easily identify this profile */
  readonly avatarImage?: Maybe<Image>;
  /** A banner to display at the top of the profile */
  readonly bannerImage?: Maybe<Image>;
  /** When the user was born */
  readonly birthday?: Maybe<Scalars['ISO8601Date']>;
  /** All comments to any post this user has made. */
  readonly comments: CommentConnection;
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** Favorite media, characters, and people */
  readonly favorites: FavoriteConnection;
  /** People that follow the user */
  readonly followers: ProfileConnection;
  /** People the user is following */
  readonly following: ProfileConnection;
  /** What the user identifies as */
  readonly gender?: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  /** The user library of their media */
  readonly library: Library;
  /** A list of library events for this user */
  readonly libraryEvents: LibraryEventConnection;
  /** The user's general location */
  readonly location?: Maybe<Scalars['String']>;
  /** Media reactions written by this user. */
  readonly mediaReactions: MediaReactionConnection;
  /** A non-unique publicly visible name for the profile. Minimum of 3 characters and any valid Unicode character */
  readonly name: Scalars['String'];
  /** Post pinned to the user profile */
  readonly pinnedPost?: Maybe<Post>;
  /** All posts this profile has made. */
  readonly posts: PostConnection;
  /** The message this user has submitted to the Hall of Fame */
  readonly proMessage?: Maybe<Scalars['String']>;
  /** The PRO level the user currently has */
  readonly proTier?: Maybe<ProTier>;
  /** Links to the user on other (social media) sites. */
  readonly siteLinks?: Maybe<SiteLinkConnection>;
  /** The URL-friendly identifier for this profile */
  readonly slug?: Maybe<Scalars['String']>;
  /** The different stats we calculate for this user. */
  readonly stats: ProfileStats;
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** A fully qualified URL to the profile */
  readonly url?: Maybe<Scalars['String']>;
  /** The character this profile has declared as their waifu or husbando */
  readonly waifu?: Maybe<Character>;
  /** The properly-gendered term for the user's waifu. This should normally only be 'Waifu' or 'Husbando' but some people are jerks, including the person who wrote this... */
  readonly waifuOrHusbando?: Maybe<Scalars['String']>;
};


/** A user profile on Kitsu */
export type ProfileCommentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user profile on Kitsu */
export type ProfileFavoritesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user profile on Kitsu */
export type ProfileFollowersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user profile on Kitsu */
export type ProfileFollowingArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user profile on Kitsu */
export type ProfileLibraryEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  kind?: Maybe<ReadonlyArray<LibraryEventKind>>;
};


/** A user profile on Kitsu */
export type ProfileMediaReactionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user profile on Kitsu */
export type ProfilePostsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user profile on Kitsu */
export type ProfileSiteLinksArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** The connection type for Profile. */
export type ProfileConnection = {
  readonly __typename?: 'ProfileConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<ProfileEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Profile>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ProfileEdge = {
  readonly __typename?: 'ProfileEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Profile>;
};

/** The different types of user stats that we calculate. */
export type ProfileStats = {
  readonly __typename?: 'ProfileStats';
  /** The total amount of anime you have watched over your whole life. */
  readonly animeAmountConsumed: AnimeAmountConsumed;
  /** The breakdown of the different categories related to the anime you have completed */
  readonly animeCategoryBreakdown: AnimeCategoryBreakdown;
  /** The total amount of manga you ahve read over your whole life. */
  readonly mangaAmountConsumed: MangaAmountConsumed;
  /** The breakdown of the different categories related to the manga you have completed */
  readonly mangaCategoryBreakdown: MangaCategoryBreakdown;
};

export type Query = {
  readonly __typename?: 'Query';
  /** All Anime in the Kitsu database */
  readonly anime: AnimeConnection;
  /** All Anime with specific Status */
  readonly animeByStatus?: Maybe<AnimeConnection>;
  /** Kitsu account details. You must supply an Authorization token in header. */
  readonly currentAccount?: Maybe<Account>;
  /** Find a single Anime by ID */
  readonly findAnimeById?: Maybe<Anime>;
  /** Find a single Anime by Slug */
  readonly findAnimeBySlug?: Maybe<Anime>;
  /** Find a single Category by ID */
  readonly findCategoryById?: Maybe<Category>;
  /** Find a single Category by Slug */
  readonly findCategoryBySlug?: Maybe<Category>;
  /** Find a single Character by ID */
  readonly findCharacterById?: Maybe<Character>;
  /** Find a single Character by Slug */
  readonly findCharacterBySlug?: Maybe<Character>;
  /** Find a single Library Entry by ID */
  readonly findLibraryEntryById?: Maybe<LibraryEntry>;
  /** Find a single Library Event by ID */
  readonly findLibraryEventById?: Maybe<LibraryEvent>;
  /** Find a single Manga by ID */
  readonly findMangaById?: Maybe<Manga>;
  /** Find a single Manga by Slug */
  readonly findMangaBySlug?: Maybe<Manga>;
  /** Find a single Person by ID */
  readonly findPersonById?: Maybe<Person>;
  /** Find a single Person by Slug */
  readonly findPersonBySlug?: Maybe<Person>;
  /** Find a single User by ID */
  readonly findProfileById?: Maybe<Profile>;
  /** Find a single User by Slug */
  readonly findProfileBySlug?: Maybe<Profile>;
  /** List trending media on Kitsu */
  readonly globalTrending: MediaConnection;
  /** List of Library Entries by MediaType and MediaId */
  readonly libraryEntriesByMedia?: Maybe<LibraryEntryConnection>;
  /** List of Library Entries by MediaType */
  readonly libraryEntriesByMediaType?: Maybe<LibraryEntryConnection>;
  /** List trending media within your network */
  readonly localTrending: MediaConnection;
  /** Find a specific Mapping Item by External ID and External Site. */
  readonly lookupMapping?: Maybe<MappingItem>;
  /** All Manga in the Kitsu database */
  readonly manga: MangaConnection;
  /** All Manga with specific Status */
  readonly mangaByStatus?: Maybe<MangaConnection>;
  /** Patrons sorted by a Proprietary Magic Algorithm */
  readonly patrons: ProfileConnection;
  /** Get your current session info */
  readonly session: Session;
};


export type QueryAnimeArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryAnimeByStatusArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  status: ReleaseStatus;
};


export type QueryFindAnimeByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindAnimeBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryFindCategoryByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindCategoryBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryFindCharacterByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindCharacterBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryFindLibraryEntryByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindLibraryEventByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindMangaByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindMangaBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryFindPersonByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindPersonBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryFindProfileByIdArgs = {
  id: Scalars['ID'];
};


export type QueryFindProfileBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGlobalTrendingArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  medium: Scalars['String'];
};


export type QueryLibraryEntriesByMediaArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  mediaType: Media_Type;
  mediaId: Scalars['ID'];
};


export type QueryLibraryEntriesByMediaTypeArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  mediaType: Media_Type;
};


export type QueryLocalTrendingArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  medium: Scalars['String'];
};


export type QueryLookupMappingArgs = {
  externalId: Scalars['ID'];
  externalSite: MappingExternalSite;
};


export type QueryMangaArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryMangaByStatusArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  status: ReleaseStatus;
};


export type QueryPatronsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A quote from a media */
export type Quote = WithTimestamps & {
  readonly __typename?: 'Quote';
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The lines of the quote */
  readonly lines: QuoteLineConnection;
  /** The media this quote is excerpted from */
  readonly media: Media;
  readonly updatedAt: Scalars['ISO8601DateTime'];
};


/** A quote from a media */
export type QuoteLinesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** The connection type for Quote. */
export type QuoteConnection = {
  readonly __typename?: 'QuoteConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<QuoteEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Quote>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type QuoteEdge = {
  readonly __typename?: 'QuoteEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Quote>;
};

/** A line in a quote */
export type QuoteLine = WithTimestamps & {
  readonly __typename?: 'QuoteLine';
  /** The character who said this line */
  readonly character: Character;
  /** The line that was spoken */
  readonly content: Scalars['String'];
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The quote this line is in */
  readonly quote: Quote;
  readonly updatedAt: Scalars['ISO8601DateTime'];
};

/** The connection type for QuoteLine. */
export type QuoteLineConnection = {
  readonly __typename?: 'QuoteLineConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<QuoteLineEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<QuoteLine>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type QuoteLineEdge = {
  readonly __typename?: 'QuoteLineEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<QuoteLine>;
};

export type RatingSystem = 
  /** 1-20 displayed as 4 smileys - Awful (1), Meh (8), Good (14) and Great (20) */
  | 'SIMPLE'
  /** 1-20 in increments of 2 displayed as 5 stars in 0.5 star increments */
  | 'REGULAR'
  /** 1-20 in increments of 1 displayed as 1-10 in 0.5 increments */
  | 'ADVANCED';

export type RecurringBillingService = 
  /** Bill a credit card via Stripe */
  | 'STRIPE'
  /** Bill a PayPal account */
  | 'PAYPAL'
  /** Billed through Apple In-App Subscription */
  | 'APPLE'
  /** Billed through Google Play Subscription */
  | 'GOOGLE_PLAY';

export type ReleaseSeason = 
  /** Released during the Winter season */
  | 'WINTER'
  /** Released during the Spring season */
  | 'SPRING'
  /** Released during the Summer season */
  | 'SUMMER'
  /** Released during the Fall season */
  | 'FALL';

export type ReleaseStatus = 
  /** The release date has not been announced yet */
  | 'TBA'
  /** This media is no longer releasing */
  | 'FINISHED'
  /** This media is currently releasing */
  | 'CURRENT'
  /** This media is releasing soon */
  | 'UPCOMING'
  /** This media is not released yet */
  | 'UNRELEASED';

/** Information about a user session */
export type Session = {
  readonly __typename?: 'Session';
  /** The account associated with this session */
  readonly account?: Maybe<Account>;
  /** The profile associated with this session */
  readonly profile?: Maybe<Profile>;
};

/** Autogenerated return type of SetDiscord */
export type SetDiscordPayload = {
  readonly __typename?: 'SetDiscordPayload';
  readonly discord: Scalars['String'];
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
};

/** Autogenerated return type of SetMessage */
export type SetMessagePayload = {
  readonly __typename?: 'SetMessagePayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly message: Scalars['String'];
};

/** A link to a user's profile on an external site. */
export type SiteLink = WithTimestamps & {
  readonly __typename?: 'SiteLink';
  /** The user profile the site is linked to. */
  readonly author: Profile;
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** A fully qualified URL of the user profile on an external site. */
  readonly url: Scalars['String'];
};

/** The connection type for SiteLink. */
export type SiteLinkConnection = {
  readonly __typename?: 'SiteLinkConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<SiteLinkEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<SiteLink>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type SiteLinkEdge = {
  readonly __typename?: 'SiteLinkEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<SiteLink>;
};

/** Media that is streamable. */
export type Streamable = {
  /** Spoken language is replaced by language of choice. */
  readonly dubs: ReadonlyArray<Scalars['String']>;
  /** Which regions this video is available in. */
  readonly regions: ReadonlyArray<Scalars['String']>;
  /** The site that is streaming this media. */
  readonly streamer: Streamer;
  /** Languages this is translated to. Usually placed at bottom of media. */
  readonly subs: ReadonlyArray<Scalars['String']>;
};

/** The streaming company. */
export type Streamer = WithTimestamps & {
  readonly __typename?: 'Streamer';
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The name of the site that is streaming this media. */
  readonly siteName: Scalars['String'];
  /** Additional media this site is streaming. */
  readonly streamingLinks: StreamingLinkConnection;
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** Videos of the media being streamed. */
  readonly videos: VideoConnection;
};


/** The streaming company. */
export type StreamerStreamingLinksArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** The streaming company. */
export type StreamerVideosArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** The stream link. */
export type StreamingLink = Streamable & WithTimestamps & {
  readonly __typename?: 'StreamingLink';
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** Spoken language is replaced by language of choice. */
  readonly dubs: ReadonlyArray<Scalars['String']>;
  readonly id: Scalars['ID'];
  /** The media being streamed */
  readonly media: Media;
  /** Which regions this video is available in. */
  readonly regions: ReadonlyArray<Scalars['String']>;
  /** The site that is streaming this media. */
  readonly streamer: Streamer;
  /** Languages this is translated to. Usually placed at bottom of media. */
  readonly subs: ReadonlyArray<Scalars['String']>;
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** Fully qualified URL for the streaming link. */
  readonly url: Scalars['String'];
};

/** The connection type for StreamingLink. */
export type StreamingLinkConnection = {
  readonly __typename?: 'StreamingLinkConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<StreamingLinkEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<StreamingLink>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type StreamingLinkEdge = {
  readonly __typename?: 'StreamingLinkEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<StreamingLink>;
};

export type TitleLanguagePreference = 
  /** Prefer the most commonly-used title for media */
  | 'CANONICAL'
  /** Prefer the romanized title for media */
  | 'ROMANIZED'
  /** Prefer the localized title for media */
  | 'LOCALIZED';

export type TitlesList = {
  readonly __typename?: 'TitlesList';
  /** A list of additional, alternative, abbreviated, or unofficial titles */
  readonly alternatives?: Maybe<ReadonlyArray<Scalars['String']>>;
  /** The official or de facto international title */
  readonly canonical?: Maybe<Scalars['String']>;
  /** The locale code that identifies which title is used as the canonical title */
  readonly canonicalLocale?: Maybe<Scalars['String']>;
  /** The list of localized titles keyed by locale */
  readonly localized: Scalars['Map'];
};


export type TitlesListLocalizedArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};

export type TitlesListInput = {
  readonly localized?: Maybe<Scalars['Map']>;
  readonly alternatives?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly canonicalLocale?: Maybe<Scalars['String']>;
};

/** Media units such as episodes or chapters */
export type Unit = {
  /** A brief summary or description of the unit */
  readonly description: Scalars['Map'];
  readonly id: Scalars['ID'];
  /** The sequence number of this unit */
  readonly number: Scalars['Int'];
  /** A thumbnail image for the unit */
  readonly thumbnail?: Maybe<Image>;
  /** The titles for this unit in various locales */
  readonly titles: TitlesList;
};


/** Media units such as episodes or chapters */
export type UnitDescriptionArgs = {
  locales?: Maybe<ReadonlyArray<Scalars['String']>>;
};

/** Autogenerated return type of Unsubscribe */
export type UnsubscribePayload = {
  readonly __typename?: 'UnsubscribePayload';
  /** Graphql Errors */
  readonly errors?: Maybe<ReadonlyArray<Generic>>;
  readonly expiresAt?: Maybe<Scalars['ISO8601DateTime']>;
};

export type UpdateProgressByIdInput = {
  readonly id: Scalars['ID'];
  readonly progress: Scalars['Int'];
};

export type UpdateProgressByMediaInput = {
  readonly mediaId: Scalars['ID'];
  readonly mediaType: Media_Type;
  readonly progress: Scalars['Int'];
};

export type UpdateRatingByIdInput = {
  readonly id: Scalars['ID'];
  /** A number between 2 - 20 */
  readonly rating: Scalars['Int'];
};

export type UpdateRatingByMediaInput = {
  readonly mediaId: Scalars['ID'];
  readonly mediaType: Media_Type;
  /** A number between 2 - 20 */
  readonly rating: Scalars['Int'];
};

export type UpdateStatusByIdInput = {
  readonly id: Scalars['ID'];
  readonly status: LibraryEntryStatus;
};

export type UpdateStatusByMediaInput = {
  readonly mediaId: Scalars['ID'];
  readonly mediaType: Media_Type;
  readonly status: LibraryEntryStatus;
};


/** The media video. */
export type Video = Streamable & WithTimestamps & {
  readonly __typename?: 'Video';
  readonly createdAt: Scalars['ISO8601DateTime'];
  /** Spoken language is replaced by language of choice. */
  readonly dubs: ReadonlyArray<Scalars['String']>;
  /** The episode of this video */
  readonly episode: Episode;
  readonly id: Scalars['ID'];
  /** Which regions this video is available in. */
  readonly regions: ReadonlyArray<Scalars['String']>;
  /** The site that is streaming this media. */
  readonly streamer: Streamer;
  /** Languages this is translated to. Usually placed at bottom of media. */
  readonly subs: ReadonlyArray<Scalars['String']>;
  readonly updatedAt: Scalars['ISO8601DateTime'];
  /** The url of the video. */
  readonly url: Scalars['String'];
};

/** The connection type for Video. */
export type VideoConnection = {
  readonly __typename?: 'VideoConnection';
  /** A list of edges. */
  readonly edges?: Maybe<ReadonlyArray<Maybe<VideoEdge>>>;
  /** A list of nodes. */
  readonly nodes?: Maybe<ReadonlyArray<Maybe<Video>>>;
  /** Information to aid in pagination. */
  readonly pageInfo: PageInfo;
  /** The total amount of nodes. */
  readonly totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type VideoEdge = {
  readonly __typename?: 'VideoEdge';
  /** A cursor for use in pagination. */
  readonly cursor: Scalars['String'];
  /** The item at the end of the edge. */
  readonly node?: Maybe<Video>;
};

/** A manga volume which can contain multiple chapters. */
export type Volume = WithTimestamps & {
  readonly __typename?: 'Volume';
  /** The chapters in this volume. */
  readonly chapters?: Maybe<ChapterConnection>;
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly id: Scalars['ID'];
  /** The isbn number of this volume. */
  readonly isbn: ReadonlyArray<Scalars['String']>;
  /** The manga this volume is in. */
  readonly manga: Manga;
  /** The volume number. */
  readonly number: Scalars['Int'];
  /** The date when this chapter was released. */
  readonly published?: Maybe<Scalars['ISO8601Date']>;
  /** The titles for this chapter in various locales */
  readonly titles: TitlesList;
  readonly updatedAt: Scalars['ISO8601DateTime'];
};


/** A manga volume which can contain multiple chapters. */
export type VolumeChaptersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type WithTimestamps = {
  readonly createdAt: Scalars['ISO8601DateTime'];
  readonly updatedAt: Scalars['ISO8601DateTime'];
};

/** これはアニメやマンガです */
export type Media_Type = 
  | 'ANIME'
  | 'MANGA';
