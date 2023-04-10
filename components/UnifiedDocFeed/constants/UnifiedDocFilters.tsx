import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUp } from "@fortawesome/pro-solid-svg-icons";
import { faComments } from "@fortawesome/pro-light-svg-icons";
import { faBolt } from "@fortawesome/pro-solid-svg-icons";
import { faClock } from "@fortawesome/pro-regular-svg-icons";
import { faFireAlt } from "@fortawesome/pro-duotone-svg-icons";
import { faHeartRate } from "@fortawesome/pro-light-svg-icons";
import { faGlobe } from "@fortawesome/pro-light-svg-icons";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";

export const topLevelFilters = {
  "/": {
    label: "Frontpage",
    value: "/",
    icon: <FontAwesomeIcon icon={faGlobe}></FontAwesomeIcon>,
  },
  "/my-hubs": {
    label: "My Hubs",
    value: "/my-hubs",
    icon: null,
  },
  // "/live": {
  //   label: "Live",
  //   value: "/live",
  //   icon: <FontAwesomeIcon icon={faHeartRate}></FontAwesomeIcon>,
  // },
};

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

export const sortOpts = {
  hot: {
    value: "hot",
    label: "Trending",
    selectedLabel: "Trending",
    icon: <FontAwesomeIcon icon={faFireAlt}></FontAwesomeIcon>,
    disableScope: true,
    availableFor: [
      feedTypeOpts["all"].value,
      feedTypeOpts["paper"].value,
      feedTypeOpts["post"].value,
      feedTypeOpts["question"].value,
      feedTypeOpts["meta-study"].value,
    ],
  },
  most_rsc: {
    value: "most_rsc",
    label: "RSC Offered",
    selectedLabel: "RSC Offered",
    icon: (
      <ResearchCoinIcon
        version={4}
        height={16}
        width={16}
        overrideStyle={undefined}
      />
    ),
    disableScope: true,
    availableFor: [feedTypeOpts["bounty"].value],
  },
  expiring_soon: {
    value: "expiring_soon",
    label: "Expiring Soon",
    selectedLabel: "Expiring Soon",
    icon: <FontAwesomeIcon icon={faClock}></FontAwesomeIcon>,
    disableScope: true,
    availableFor: [feedTypeOpts["bounty"].value],
  },
  new: {
    value: "new",
    label: "Newest",
    selectedLabel: "Newest",
    icon: <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>,
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
  discussed: {
    value: "discussed",
    label: "Most Discussed",
    selectedLabel: "Discussed",
    icon: <FontAwesomeIcon icon={faComments}></FontAwesomeIcon>,
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
  upvoted: {
    value: "upvoted",
    label: "Most Upvoted",
    selectedLabel: "Upvoted",
    icon: <FontAwesomeIcon icon={faUp}></FontAwesomeIcon>,
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
};

export const tagFilters = {
  peer_reviewed: {
    value: "peer_reviewed",
    label: "Peer reviewed",
    availableFor: [
      feedTypeOpts["all"].value,
      feedTypeOpts["paper"].value,
      feedTypeOpts["post"].value,
    ],
  },
  open_access: {
    value: "open_access",
    label: "Open access",
    availableFor: [feedTypeOpts["all"].value, feedTypeOpts["paper"].value],
  },
  author_claimed: {
    value: "author_claimed",
    label: "Author claimed",
    availableFor: [feedTypeOpts["paper"].value],
  },
  // "open,closed,expired": {
  //   value: "open,closed,expired",
  //   label: "Closed bounties",
  //   availableFor: [feedTypeOpts["bounty"].value],
  // },
  answered: {
    value: "answered",
    label: "Answered",
    availableFor: [feedTypeOpts["question"].value],
  },
};

export const scopeOptions = {
  today: {
    value: "today",
    valueForApi: "today",
    label: "Today",
    isDefault: true,
  },
  week: {
    value: "week",
    valueForApi: "week",
    label: "This Week",
  },
  month: {
    value: "month",
    valueForApi: "month",
    label: "This Month",
  },
  year: {
    value: "year",
    valueForApi: "year",
    label: "This Year",
  },
  "all-time": {
    value: "all-time",
    valueForApi: "all",
    label: "All Time",
  },
};
