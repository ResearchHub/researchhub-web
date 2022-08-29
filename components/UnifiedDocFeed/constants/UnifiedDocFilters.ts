import icons from "~/config/themes/icons";

export const topLevelFilters = [
  {
    label: "Frontpage",
    url: "/",
    value: "frontpage",
    icon: icons.globeLight,
  },
  {
    label: "My Hubs",
    url: "/my-hubs",
    value: "my-hubs",
  },
];

export const UnifiedDocFilters = {
  // intentional ordering
  ALL: "all",
  PAPER: "paper",
  POSTS: "posts",
  HYPOTHESIS: "hypothesis",
};

export const UnifiedDocFilterLabels = {
  ALL: "All",
  HYPOTHESIS: "Hypotheses",
  PAPER: "Papers",
  POSTS: "Posts",
};

export const feedTypeOpts = {
  all: {
    value: "all",
    label: "All",
  },
  paper: {
    value: "paper",
    label: "Papers",
  },
  post: {
    value: "post",
    label: "Posts",
  },
  question: {
    value: "question",
    label: "Questions",
  },
  "meta-study": {
    value: "meta-study",
    label: "Meta-Studies",
  },
  bounty: {
    value: "bounty",
    label: "Bounties",
  },
};

export const sortOpts = [
  {
    value: "hot",
    label: "Trending",
    selectedLabel: "Trending",
    icon: icons.fire,
    disableScope: true,
    availableFor: [
      feedTypeOpts["all"].value,
      feedTypeOpts["paper"].value,
      feedTypeOpts["post"].value,
      feedTypeOpts["question"].value,
      feedTypeOpts["meta-study"].value,
      feedTypeOpts["bounty"].value,
    ],
  },
  // {
  //   value: "expiring_soon",
  //   label: "Expiring Soon",
  //   selectedLabel: "Expiring Soon",
  //   icon: icons.clock,
  //   disableScope: true,
  //   availableFor: [
  //     feedTypeOpts["bounty"].value,
  //   ],
  // },
  // {
  //   value: "rsc_offered",
  //   label: "RSC Offered",
  //   selectedLabel: "RSC Offered",
  //   icon: icons.clock,
  //   disableScope: true,
  //   availableFor: [
  //     feedTypeOpts["bounty"].value,
  //   ],
  // },
  {
    value: "newest",
    label: "Newest",
    selectedLabel: "Newest",
    icon: icons.bolt,
    disableScope: false,
    availableFor: [
      feedTypeOpts["all"].value,
      feedTypeOpts["paper"].value,
      feedTypeOpts["post"].value,
      feedTypeOpts["question"].value,
      feedTypeOpts["meta-study"].value,
      feedTypeOpts["bounty"].value,
    ],
  },
  {
    value: "most_discussed",
    label: "Most Discussed",
    selectedLabel: "Discussed",
    icon: icons.commentsAlt,
    disableScope: false,
    availableFor: [
      feedTypeOpts["all"].value,
      feedTypeOpts["paper"].value,
      feedTypeOpts["post"].value,
      feedTypeOpts["question"].value,
      feedTypeOpts["meta-study"].value,
      feedTypeOpts["bounty"].value,
    ],
  },
  {
    value: "top_rated",
    label: "Most Upvoted",
    selectedLabel: "Upvoted",
    icon: icons.up,
    disableScope: false,
    availableFor: [
      feedTypeOpts["all"].value,
      feedTypeOpts["paper"].value,
      feedTypeOpts["post"].value,
      feedTypeOpts["question"].value,
      feedTypeOpts["meta-study"].value,
      feedTypeOpts["bounty"].value,
    ],
  },
];

export const tagFilters = [
  {
    value: "peer_reviewed",
    label: "Peer reviewed",
    availableFor: [
      feedTypeOpts["all"].value,
      feedTypeOpts["paper"].value,
      feedTypeOpts["post"].value,
    ],
  },
  {
    value: "open_access",
    label: "Open access",
    availableFor: [feedTypeOpts["all"].value, feedTypeOpts["paper"].value],
  },
  {
    value: "expired",
    label: "Show expired bounties",
    availableFor: [feedTypeOpts["bounty"].value],
  },
  {
    value: "answered",
    label: "Show answered",
    availableFor: [feedTypeOpts["question"].value],
  },
];
