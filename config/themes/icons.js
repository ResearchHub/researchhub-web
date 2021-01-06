import React from "react";
import { StyleSheet, css } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faExternalLinkAlt,
  faShare,
  faShareAlt,
  faBell,
  faFlag,
  faCertificate,
  faMinus,
  faUpload,
  faPlay,
  faStop,
  faPlusCircle as faPlusCircleSolid,
  faPlusSquare,
  faBolt,
  faFile,
  faEdit,
  faCheck,
  faUser,
  faBan,
  faExclamationTriangle,
  faThumbtack,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { faChartNetwork, faPencil } from "@fortawesome/pro-solid-svg-icons";
import {
  faLongArrowLeft,
  faBars,
  faPlus,
  faPlusCircle,
  faCheckCircle,
  faTrashAlt,
  faTasksAlt,
  faThumbtack as faThumbtackOutline,
} from "@fortawesome/pro-light-svg-icons";
import {
  faEllipsisH,
  faCalendarDay,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faStar as faStarFilled,
} from "@fortawesome/pro-regular-svg-icons";
import {
  faHome,
  faQuestionCircle,
  faInfoCircle,
  faFileUpload,
  faSignOut,
  faUserCircle,
  faUser as faSimpleUser,
  faFileAlt,
  faCoin,
  faCoins,
  faMinusCircle,
  faTrophy,
  faFireAlt,
  faList,
  faStar as faStarOutline,
} from "@fortawesome/pro-duotone-svg-icons";

const icons = {
  chat: <FontAwesomeIcon icon={faComment} />,
  externalLink: <FontAwesomeIcon icon={faExternalLinkAlt} />,
  longArrowLeft: <FontAwesomeIcon icon={faLongArrowLeft} />,
  share: <FontAwesomeIcon icon={faShare} />,
  shareAlt: <FontAwesomeIcon icon={faShareAlt} />,
  burgerMenu: <FontAwesomeIcon icon={faBars} />,
  home: <FontAwesomeIcon icon={faHome} />,
  help: <FontAwesomeIcon icon={faQuestionCircle} />,
  hub: <FontAwesomeIcon icon={faChartNetwork} />,
  "info-circle": <FontAwesomeIcon icon={faInfoCircle} />,
  addPaper: <FontAwesomeIcon icon={faFileUpload} />,
  signOut: <FontAwesomeIcon icon={faSignOut} />,
  user: <FontAwesomeIcon icon={faUserCircle} />,
  simpleUser: <FontAwesomeIcon icon={faSimpleUser} />,
  file: <FontAwesomeIcon icon={faFileAlt} />,
  coins: <FontAwesomeIcon icon={faCoins} />,
  bell: <FontAwesomeIcon icon={faBell} />,
  live: <FontAwesomeIcon icon={faBell} />,
  flag: <FontAwesomeIcon icon={faFlag} />,
  badge: <FontAwesomeIcon icon={faCertificate} />,
  minus: <FontAwesomeIcon icon={faMinus} />,
  minusCircle: <FontAwesomeIcon icon={faMinusCircle} />,
  ellipsisH: <FontAwesomeIcon icon={faEllipsisH} />,
  date: <FontAwesomeIcon icon={faCalendarDay} />,
  upload: <FontAwesomeIcon icon={faUpload} />,
  plusCircle: <FontAwesomeIcon icon={faPlusCircle} />,
  plus: <FontAwesomeIcon icon={faPlus} />,
  plusCircleSolid: <FontAwesomeIcon icon={faPlusCircleSolid} />,
  plusSquare: <FontAwesomeIcon icon={faPlusSquare} />,
  play: <FontAwesomeIcon icon={faPlay} />,
  stop: <FontAwesomeIcon icon={faStop} />,
  chevronLeft: <FontAwesomeIcon icon={faChevronLeft} />,
  chevronRight: <FontAwesomeIcon icon={faChevronRight} />,
  chevronDown: <FontAwesomeIcon icon={faChevronDown} />,
  chevronUp: <FontAwesomeIcon icon={faChevronUp} />,
  pencil: <FontAwesomeIcon icon={faPencil} />,
  trophy: <FontAwesomeIcon icon={faTrophy} />,
  check: <FontAwesomeIcon icon={faCheck} />,
  checkCircle: <FontAwesomeIcon icon={faCheckCircle} />,
  bolt: <FontAwesomeIcon icon={faBolt} />,
  subscribers: <FontAwesomeIcon icon={faUser} />,
  paper: <FontAwesomeIcon icon={faFile} />,
  editHub: <FontAwesomeIcon icon={faEdit} />,
  trash: <FontAwesomeIcon icon={faTrashAlt} />,
  ban: <FontAwesomeIcon icon={faBan} />,
  error: <FontAwesomeIcon icon={faExclamationTriangle} />,
  starFilled: <FontAwesomeIcon icon={faStarFilled} />,
  starEmpty: <FontAwesomeIcon icon={faStarOutline} />,
  manage: <FontAwesomeIcon icon={faTasksAlt} />,
  pin: <FontAwesomeIcon icon={faThumbtack} />,
  pinOutline: <FontAwesomeIcon icon={faThumbtackOutline} />,
  fire: <FontAwesomeIcon icon={faFireAlt} />,
  coin: <FontAwesomeIcon icon={faCoin} />,
  takeaway: <FontAwesomeIcon icon={faList} />,
  coinStack: ({ styles, grey }) => (
    <img
      src={
        grey
          ? "/static/icons/coin-stack-grey.png"
          : "/static/icons/coin-stack.png"
      }
      className={css(styles)}
      alt="Coin Stack Icon"
    />
  ),
  partyPopper: (props = {}) => {
    const { style } = props;
    return (
      <img
        className={css(styles.iconPartyPopper, style && style)}
        src={"/static/icons/party-popper.png"}
        alt="Party Popper Icon"
      />
    );
  },
  RSC: (props = {}) => {
    const { style } = props;
    return (
      <img
        className={css(styles.iconRSC, style && style)}
        src={"/static/icons/coin-filled.png"}
        alt="RSC Coin"
      />
    );
  },
};

export const voteWidgetIcons = {
  upvote: <FontAwesomeIcon icon={faCaretUp} />,
  downvote: <FontAwesomeIcon icon={faCaretDown} />,
};

export const textEditorIcons = {
  bold: <i className="fas fa-bold"></i>,
  italic: <i className="fas fa-italic"></i>,
  underline: <i className="fas fa-underline"></i>,
  code: <i className="fas fa-brackets-curly"></i>,
  h1: <i className="fas fa-h1"></i>,
  h2: <i className="fas fa-h2"></i>,
  quote: <i className="fas fa-quote-right"></i>,
  bulletedList: <i className="fas fa-list-ul"></i>,
  numberedList: <i className="fas fa-list-ol"></i>,
  link: <i className="far fa-link"></i>,
  image: <i className="far fa-image-polaroid"></i>,
  video: <i className="far fa-video-plus"></i>,
};

export const RHLogo = ({ iconStyle, white }) => {
  return (
    <img
      src={white ? "/static/white_logo.png" : "/static/ResearchHubLogo.png"}
      className={css(styles.logo, iconStyle && iconStyle)}
      draggable={false}
      alt="RH Logo"
    />
  );
};

export const BoltSvg = ({ height, width, color, opacity }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ? width : "9"}
      height={height ? height : "13"}
      fill="none"
      viewBox="0 0 9 13"
    >
      <path
        fill={color ? color : "#241F3A"}
        d="M5.063 5.318H9L3.937 13V7.682H0L5.063 0v5.318z"
        opacity={opacity ? opacity : "0.5"}
      />
    </svg>
  );
};
const styles = StyleSheet.create({
  logo: {
    height: 40,
  },
  coinStack: {},
  iconPartyPopper: {
    height: 15,
  },
  iconRSC: {
    height: 15,
  },
});

export default icons;
