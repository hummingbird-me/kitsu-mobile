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
] as const;
