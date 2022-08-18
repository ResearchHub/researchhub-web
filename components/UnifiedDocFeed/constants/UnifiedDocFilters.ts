import icons from "~/config/themes/icons";

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

export const feedTypeOpts = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "paper",
    label: "Papers",
  },
  {
    value: "posts",
    label: "Posts",
  },
  {
    value: "question",
    label: "Questions",
  },
  {
    value: "hypothesis",
    label: "Meta-Studies",
  },
  {
    value: "bounties",
    tag: { bounties: "all" },
    label: "Bounties",
  },
];
