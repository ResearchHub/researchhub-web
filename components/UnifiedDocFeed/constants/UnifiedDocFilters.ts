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
  {
    value: "author_claimed",
    label: "Author Claimed",
    selectedLabel: "Claimed",
    icon: icons.verifiedBadgeAlt,
    disableScope: true,
  },
];
