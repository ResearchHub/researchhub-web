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
    placeholder: "What are your thoughts about this paper?",
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

export const filterOpts = [{
  label: "All",
  value: null,
},{
  label: "Bounties",
  value: "BOUNTY",  
},{
  label: "Peer reviews",
  value: "REVIEW",
}];

export const sortOpts = [{
  label: "Best",
  value: "BEST",
  icon: <FontAwesomeIcon icon={faStarIcon} />,
},{
  label: "Newest",
  value: "CREATED_DATE",
  icon: <FontAwesomeIcon icon={faBolt} />,
}, {
  label: "Upvoted",
  value: "TOP",
  icon: <FontAwesomeIcon icon={faArrowAltUp} />,
}];
