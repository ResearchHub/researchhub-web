import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faStar } from "@fortawesome/pro-light-svg-icons";

export type SortOptionValue = "CREATED_DATE" | "BET_AMOUNT";

export const SortOptions = [
  {
    label: "Newest",
    value: "CREATED_DATE",
    icon: <FontAwesomeIcon icon={faBolt} />,
  },
  {
    label: "RSC",
    value: "BET_AMOUNT",
    icon: <FontAwesomeIcon icon={faStar} />,
  },
];
