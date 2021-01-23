import React from "react";
import { StyleSheet, css } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faAngleRight,
  faArrowRight,
  faAsterisk,
  faBan,
  faBold,
  faBell,
  faBolt,
  faCaretDown,
  faCaretUp,
  faCertificate,
  faChartLine,
  faCheck,
  faComment,
  faCog,
  faEdit,
  faExclamationCircle,
  faExclamationTriangle,
  faExternalLinkAlt,
  faFile,
  faFlag,
  faGraduationCap,
  faItalic,
  faLink,
  faMinus,
  faPlay,
  faPlusCircle as faPlusCircleSolid,
  faPlusSquare,
  faPortrait,
  faSearch,
  faShare,
  faShareAlt,
  faStar as faStarFilled,
  faStop,
  faThLarge,
  faThumbsUp as solidThumbsUp,
  faThumbsDown as solidThumbsDown,
  faThumbtack,
  faUnderline,
  faUpload,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faLinkedinIn,
  faSlack,
  faTwitter,
  faReddit,
} from "@fortawesome/fontawesome-free-brands";
import {
  faArrowToBottom,
  faBracketsCurly,
  faChartNetwork,
  faH1,
  faH2,
  faImagePolaroid,
  faListUl,
  faListOl,
  faMousePointer,
  faPencil,
  faUserSlash,
  faQuoteRight,
  faVideoPlus,
} from "@fortawesome/pro-solid-svg-icons";
import {
  faAngleDown,
  faAngleUp,
  faBars,
  faCheckCircle,
  faChevronDown as falChevronDown,
  faExpandArrows,
  faLongArrowLeft,
  faPlus,
  faPlusCircle,
  faTasksAlt,
  faThumbtack as faThumbtackOutline,
  faTimes,
  faTimesCircle,
  faTrashAlt,
} from "@fortawesome/pro-light-svg-icons";
import {
  faEllipsisH,
  faCalendarDay,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faFlag as faFlagOutline,
  faStar as faStarOutline,
} from "@fortawesome/pro-regular-svg-icons";
import {
  faBook,
  faCoin,
  faCoins,
  faCommentAltEdit,
  faCommentAltDots,
  faCommentAltLines,
  faComments,
  faEye,
  faEyeSlash,
  faFileAlt,
  faFireAlt,
  faFileUpload,
  faGlobeAmericas,
  faHome,
  faInfoCircle,
  faImage,
  faList,
  faMinusCircle,
  faPaperPlane,
  faQuestionCircle,
  faReceipt,
  faShareSquare,
  faSignOut,
  faSortAmountUpAlt,
  faStarHalf,
  faThumbsUp as opaqueThumbsUp,
  faThumbsDown as opaqueThumbsDown,
  faTrophy,
  faUser as faSimpleUser,
  faUserCircle,
} from "@fortawesome/pro-duotone-svg-icons";

library.add(
  faAngleLeft,
  faAngleRight,
  faArrowRight,
  faAsterisk,
  faBan,
  faBold,
  faBell,
  faBolt,
  faCaretDown,
  faCaretUp,
  faCertificate,
  faCheck,
  faComment,
  faCog,
  faEdit,
  faExclamationCircle,
  faExclamationTriangle,
  faExternalLinkAlt,
  faFile,
  faFlag,
  faGraduationCap,
  faItalic,
  faLink,
  faMinus,
  faPlay,
  faPlusCircleSolid,
  faPlusSquare,
  faPortrait,
  faSearch,
  faShare,
  faShareAlt,
  faStarFilled,
  faStop,
  solidThumbsUp,
  solidThumbsDown,
  faThumbtack,
  faUnderline,
  faUpload,
  faUser,
  faUserPlus,
  faFacebookF,
  faLinkedinIn,
  faReddit,
  faSlack,
  faTwitter,
  faArrowToBottom,
  faBracketsCurly,
  faChartNetwork,
  faH1,
  faH2,
  faImagePolaroid,
  faListUl,
  faListOl,
  faMousePointer,
  faPencil,
  faUserSlash,
  faQuoteRight,
  faVideoPlus,
  faAngleDown,
  faAngleUp,
  faBars,
  faCheckCircle,
  falChevronDown,
  faExpandArrows,
  faLongArrowLeft,
  faPlus,
  faPlusCircle,
  faTasksAlt,
  faThumbtackOutline,
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faEllipsisH,
  faCalendarDay,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faFlagOutline,
  faStarOutline,
  faBook,
  faCoin,
  faCoins,
  faCommentAltEdit,
  faCommentAltDots,
  faCommentAltLines,
  faComments,
  faEye,
  faEyeSlash,
  faFileAlt,
  faFireAlt,
  faFileUpload,
  faGlobeAmericas,
  faHome,
  faInfoCircle,
  faImage,
  faList,
  faMinusCircle,
  faPaperPlane,
  faQuestionCircle,
  faReceipt,
  faShareSquare,
  faSignOut,
  faSortAmountUpAlt,
  faStarHalf,
  opaqueThumbsUp,
  opaqueThumbsDown,
  faTrophy,
  faSimpleUser,
  faUserCircle
);

const icons = {
  addPaper: <FontAwesomeIcon icon={faFileUpload} />,
  angleLeft: <FontAwesomeIcon icon={faAngleLeft} />,
  angleRight: <FontAwesomeIcon icon={faAngleRight} />,
  angleDown: <FontAwesomeIcon icon={faAngleDown} />,
  angleUp: <FontAwesomeIcon icon={faAngleUp} />,
  arrowRight: <FontAwesomeIcon icon={faArrowRight} />,
  arrowToBottom: <FontAwesomeIcon icon={faArrowToBottom} />,
  asterisk: <FontAwesomeIcon icon={faAsterisk} />,
  ban: <FontAwesomeIcon icon={faBan} />,
  badge: <FontAwesomeIcon icon={faCertificate} />,
  bell: <FontAwesomeIcon icon={faBell} />,
  bolt: <FontAwesomeIcon icon={faBolt} />,
  book: <FontAwesomeIcon icon={faBook} />,
  burgerMenu: <FontAwesomeIcon icon={faBars} />,
  chartLine: <FontAwesomeIcon icon={faChartLine} />,
  chat: <FontAwesomeIcon icon={faComment} />,
  check: <FontAwesomeIcon icon={faCheck} />,
  checkCircle: <FontAwesomeIcon icon={faCheckCircle} />,
  chevronLeft: <FontAwesomeIcon icon={faChevronLeft} />,
  chevronRight: <FontAwesomeIcon icon={faChevronRight} />,
  chevronDown: <FontAwesomeIcon icon={faChevronDown} />,
  chevronUp: <FontAwesomeIcon icon={faChevronUp} />,
  chevronDownLeft: <FontAwesomeIcon icon={falChevronDown} />,
  cog: <FontAwesomeIcon icon={faCog} />,
  coin: <FontAwesomeIcon icon={faCoin} />,
  coins: <FontAwesomeIcon icon={faCoins} />,
  commentAltEdit: <FontAwesomeIcon icon={faCommentAltEdit} />,
  commentAltDots: <FontAwesomeIcon icon={faCommentAltDots} />,
  commentAltLine: <FontAwesomeIcon icon={faCommentAltLines} />,
  comments: <FontAwesomeIcon icon={faComments} />,
  date: <FontAwesomeIcon icon={faCalendarDay} />,
  editHub: <FontAwesomeIcon icon={faEdit} />,
  ellipsisH: <FontAwesomeIcon icon={faEllipsisH} />,
  error: <FontAwesomeIcon icon={faExclamationTriangle} />,
  exclamationCircle: <FontAwesomeIcon icon={faExclamationCircle} />,
  expandArrows: <FontAwesomeIcon icon={faExpandArrows} />,
  externalLink: <FontAwesomeIcon icon={faExternalLinkAlt} />,
  eye: <FontAwesomeIcon icon={faEye} />,
  eyeSlash: <FontAwesomeIcon icon={faEyeSlash} />,
  facebook: <FontAwesomeIcon icon={faFacebookF} />,
  file: <FontAwesomeIcon icon={faFileAlt} />,
  fire: <FontAwesomeIcon icon={faFireAlt} />,
  flag: <FontAwesomeIcon icon={faFlag} />,
  flagOutline: <FontAwesomeIcon icon={faFlagOutline} />,
  globe: <FontAwesomeIcon icon={faGlobeAmericas} />,
  graduationCap: <FontAwesomeIcon icon={faGraduationCap} />,
  home: <FontAwesomeIcon icon={faHome} />,
  help: <FontAwesomeIcon icon={faQuestionCircle} />,
  hub: <FontAwesomeIcon icon={faChartNetwork} />,
  image: <FontAwesomeIcon icon={faImage} />,
  "info-circle": <FontAwesomeIcon icon={faInfoCircle} />,
  link: <FontAwesomeIcon icon={faLink} />,
  linkedIn: <FontAwesomeIcon icon={faLinkedinIn} />,
  live: <FontAwesomeIcon icon={faBell} />,
  longArrowLeft: <FontAwesomeIcon icon={faLongArrowLeft} />,
  manage: <FontAwesomeIcon icon={faTasksAlt} />,
  minus: <FontAwesomeIcon icon={faMinus} />,
  minusCircle: <FontAwesomeIcon icon={faMinusCircle} />,
  mousePointer: <FontAwesomeIcon icon={faMousePointer} />,
  opaqueThumbsDown: <FontAwesomeIcon icon={opaqueThumbsDown} />,
  opaqueThumbsUp: <FontAwesomeIcon icon={opaqueThumbsUp} />,
  paper: <FontAwesomeIcon icon={faFile} />,
  paperPlane: <FontAwesomeIcon icon={faPaperPlane} />,
  pencil: <FontAwesomeIcon icon={faPencil} />,
  pin: <FontAwesomeIcon icon={faThumbtack} />,
  pinOutline: <FontAwesomeIcon icon={faThumbtackOutline} />,
  play: <FontAwesomeIcon icon={faPlay} />,
  plus: <FontAwesomeIcon icon={faPlus} />,
  plusCircle: <FontAwesomeIcon icon={faPlusCircle} />,
  plusCircleSolid: <FontAwesomeIcon icon={faPlusCircleSolid} />,
  plusSquare: <FontAwesomeIcon icon={faPlusSquare} />,
  portrait: <FontAwesomeIcon icon={faPortrait} />,
  receipt: <FontAwesomeIcon icon={faReceipt} />,
  reddit: <FontAwesomeIcon icon={faReddit} />,
  search: <FontAwesomeIcon icon={faSearch} />,
  share: <FontAwesomeIcon icon={faShare} />,
  shareAlt: <FontAwesomeIcon icon={faShareAlt} />,
  shareSquare: <FontAwesomeIcon icon={faShareSquare} />,
  signOut: <FontAwesomeIcon icon={faSignOut} />,
  simpleUser: <FontAwesomeIcon icon={faSimpleUser} />,
  slack: <FontAwesomeIcon icon={faSlack} />,
  solidThumbsUp: <FontAwesomeIcon icon={solidThumbsUp} />,
  solidThumbsDown: <FontAwesomeIcon icon={solidThumbsDown} />,
  sortAmountUpAlt: <FontAwesomeIcon icon={faSortAmountUpAlt} />,
  squares: <FontAwesomeIcon icon={faThLarge} />,
  starFilled: <FontAwesomeIcon icon={faStarFilled} />,
  starEmpty: <FontAwesomeIcon icon={faStarOutline} />,
  starHalf: <FontAwesomeIcon icon={faStarHalf} />,
  stop: <FontAwesomeIcon icon={faStop} />,
  subscribers: <FontAwesomeIcon icon={faUser} />,
  takeaway: <FontAwesomeIcon icon={faList} />,
  times: <FontAwesomeIcon icon={faTimes} />,
  timesCircle: <FontAwesomeIcon icon={faTimesCircle} />,
  trash: <FontAwesomeIcon icon={faTrashAlt} />,
  trophy: <FontAwesomeIcon icon={faTrophy} />,
  twitter: <FontAwesomeIcon icon={faTwitter} />,
  upload: <FontAwesomeIcon icon={faUpload} />,
  user: <FontAwesomeIcon icon={faUserCircle} />,
  userPlus: <FontAwesomeIcon icon={faUserPlus} />,
  userSlash: <FontAwesomeIcon icon={faUserSlash} />,
  // customIcons
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
  bold: <FontAwesomeIcon icon={faBold} />,
  italic: <FontAwesomeIcon icon={faItalic} />,
  underline: <FontAwesomeIcon icon={faUnderline} />,
  code: <FontAwesomeIcon icon={faBracketsCurly} />,
  h1: <FontAwesomeIcon icon={faH1} />,
  h1: <FontAwesomeIcon icon={faH2} />,
  quote: <FontAwesomeIcon icon={faQuoteRight} />,
  bulletedList: <FontAwesomeIcon icon={faListUl} />,
  numberedList: <FontAwesomeIcon icon={faListOl} />,
  link: <FontAwesomeIcon icon={faLink} />,
  image: <FontAwesomeIcon icon={faImagePolaroid} />,
  video: <FontAwesomeIcon icon={faVideoPlus} />,
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
