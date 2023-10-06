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
import { COMMENT_FILTERS, COMMENT_TYPES } from "./types";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";

export const commentTypes = [
  {
    label: "Discuss",
    value: COMMENT_TYPES.DISCUSSION,
    isDefault: true,
    group: "contribute",
    // @ts-ignore
    icon: <FontAwesomeIcon icon={faComments} />,
    placeholder: "Add a comment or start a bounty",
  },
  {
    label: "Peer review",
    value: COMMENT_TYPES.REVIEW,
    isDefault: false,
    placeholder: "What are your overall impressions of this paper?",
    // @ts-ignore
    icon: <FontAwesomeIcon icon={faStar} />,
  },
  {
    label: "Summary",
    value: COMMENT_TYPES.SUMMARY,
    isDefault: false,
    placeholder: "Share a summary of this paper with the community",
    // @ts-ignore
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
  },
  {
    label: "Replicability",
    value: COMMENT_TYPES.REPLICABILITY_COMMENT,
    isDefault: false,
    placeholder:
      "Add a comment on why you think this paper is replicable or not",
    // @ts-ignore
    icon: <FontAwesomeIcon icon={faCheckCircle} />,
  },
];

export const filterOpts = [
  {
    label: "All",
    value: null,
  },
  {
    label: "Bounties",
    value: COMMENT_FILTERS.BOUNTY,
  },
  {
    label: "Peer reviews",
    value: COMMENT_FILTERS.REVIEW,
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
