import icons from "~/config/themes/icons";

export const topLevelFilters = [{
  label: "Frontpage",
  url: "/",
  value: "frontpage",
  icon: icons.globeLight,
  isDefault: true,
}, {
  label: "For you",
  url: "/for-you",
  value: "for-you",
}]

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

export const sortOpts = [
  {
    value: "hot",
    label: "Trending",
    selectedLabel: "Trending",
    icon: icons.fire,
    isDefault: true,
    disableScope: true,
  },
  {
    value: "newest",
    label: "Newest",
    selectedLabel: "Newest",
    icon: icons.bolt,
    disableScope: false,
  },  
  {
    value: "most_discussed",
    label: "Most Discussed",
    selectedLabel: "Discussed",
    icon: icons.commentsAlt,
    disableScope: false,
  },
  {
    value: "top_rated",
    label: "Most Upvoted",
    selectedLabel: "Upvoted",
    icon: icons.up,
    disableScope: false,
  },
];

export const feedTypeOpts = {
  "all": {
    value: "all",
    label: "All",
    isDefault: true,
  },
  "paper": {
    value: "paper",
    label: "Papers",
  },
  "post": {
    value: "post",
    label: "Posts",
  },
  "question": {
    value: "question",
    label: "Questions",
  },
  "meta-study": {
    value: "meta-study",
    label: "Meta-Studies",
  },
  "bounty": {
    value: "bounty",
    label: "Bounties",
    tag: { bounties: "all" },
  },
}

export const subFilters = [{
  value: "peer_reviewed",
  label: "Peer reviewed",
  availableFor: [
    feedTypeOpts["all"],
    feedTypeOpts["paper"],
    feedTypeOpts["post"]
  ],
},{
  value: "open_access",
  label: "Open access",
  availableFor: [
    feedTypeOpts["all"],
    feedTypeOpts["paper"],
  ],
},{
  value: "expired",
  label: "Show expired bounties",
  availableFor: [
    feedTypeOpts["bounty"],
  ],
},{
  value: "answered",
  label: "Show answered",
  availableFor: [
    feedTypeOpts["question"],
  ],
}]