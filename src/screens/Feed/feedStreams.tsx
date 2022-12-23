export const feedStreams = [
  {
    key: 'followingFeed',
    label: 'Following',
    title: 'Follower Feed',
    description: 'Shared with all of your followers',
    selectable: true,
    targetInterest: null,
  },
  {
    key: 'globalFeed',
    label: 'Global',
    title: 'Global Feed',
    description: 'Shared with everyone',
    selectable: false,
    targetInterest: null,
  },
  // Disabled anime and manga feeds
  // {
  //   key: 'animeFeed',
  //   label: 'Anime',
  //   title: 'Anime Feed',
  //   description: 'Shared with your followers and all anime fans',
  //   selectable: true,
  //   targetInterest: 'Anime',
  // },
  // {
  //   key: 'mangaFeed',
  //   label: 'Manga',
  //   title: 'Manga Feed',
  //   description: 'Shared with your followers and all manga fans',
  //   selectable: true,
  //   targetInterest: 'Manga',
  // },
];
