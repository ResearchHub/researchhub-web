import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faStar, faLayerGroup, faCaretDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { COMMENT_TYPES } from "./types";

const commentTypes = [
  {
    label: "Discuss",
    verb: "discussing",
    value: COMMENT_TYPES.DISCUSSION,
    isDefault: true,
    group: "contribute",
    icon: <FontAwesomeIcon icon={faComments} />,
    placeholder: "What are your thoughts about this paper?",
  },
  {
    label: "Peer review",
    verb: "peer reviewing",
    value: COMMENT_TYPES.REVIEW,
    isDefault: false,
    group: "contribute",
    placeholder: "What are your overall impressions of this paper?",
    icon: <FontAwesomeIcon icon={faStar} />,
  },
  {
    label: "Summary",
    verb: "summarizing",
    value: COMMENT_TYPES.SUMMARY,
    isDefault: false,
    group: "contribute",
    placeholder: "Share a summary of this paper with the community",
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
  },
];

export default commentTypes;