import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faStar,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarIcon,
  faBolt,
  faArrowAltUp,
} from "@fortawesome/pro-light-svg-icons";
import { COMMENT_TYPES } from "./types";

export const commentTypes = [
  {
    label: "Discuss",
    value: COMMENT_TYPES.DISCUSSION,
    isDefault: true,
    group: "contribute",
    icon: <FontAwesomeIcon icon={faComments} />,
    placeholder: "Add a comment or start a bounty",
  },
  {
    label: "Peer review",
    value: COMMENT_TYPES.REVIEW,
    isDefault: false,
    placeholder: "What are your overall impressions of this paper?",
    icon: <FontAwesomeIcon icon={faStar} />,
  },
  {
    label: "Summary",
    value: COMMENT_TYPES.SUMMARY,
    isDefault: false,
    placeholder: "Share a summary of this paper with the community",
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
  },
];

export const filterOpts = [
  {
    label: "All",
    value: null,
  },
  {
    label: "Bounties",
    value: "BOUNTY",
  },
  {
    label: "Peer reviews",
    value: "REVIEW",
  },
];

export const sortOpts = [
  {
    label: "Best",
    value: "BEST",
    icon: <FontAwesomeIcon icon={faStarIcon} />,
  },
  {
    label: "Newest",
    value: "CREATED_DATE",
    icon: <FontAwesomeIcon icon={faBolt} />,
  },
  {
    label: "Upvoted",
    value: "TOP",
    icon: <FontAwesomeIcon icon={faArrowAltUp} />,
  },
];

export const reviewCategories = {
  overall: {
    label: "Overall Rating",
    value: "overall",
    description: "What are your overall impressions of this paper?",
    isDefault: true,
  },
  impact: {
    label: "Impact",
    value: "impact",
    description:
      "Is the research question innovative? Do the study's findings advance the authors' field in a meaningful way?",
    isDefault: false,
  },
  methods: {
    label: "Methods",
    value: "methods",
    description:
      "Does the study design test the authors' hypothesis? Are the methods described in enough detail for independent replication?",
    isDefault: false,
  },
  results: {
    label: "Results",
    value: "results",
    description:
      "Were the study's findings analyzed and interpreted reasonably? Is the resulting data open and auditable?",
    isDefault: false,
  },
  discussion: {
    label: "Discussion",
    value: "discussion",
    description:
      "Do the results support the authors’ conclusions? Are there any alternative interpretations of the study's findings that the authors should have considered?",
    isDefault: false,
  },
};
