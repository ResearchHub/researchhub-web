import * as React from "react";
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
  faBookOpen,
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
  faUserEdit,
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
  faCommentAltPlus,
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
  faWallet,
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
  faBookOpen,
  faBell,
  faBolt,
  faCaretDown,
  faCaretUp,
  faCertificate,
  faCheck,
  faComment,
  faCommentAltPlus,
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
  faUserCircle,
  faUserEdit,
  faWallet
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
  bookOpen: <FontAwesomeIcon icon={faBookOpen} />,
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
  commentAltPlus: <FontAwesomeIcon icon={faCommentAltPlus} />,
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
  userEdit: <FontAwesomeIcon icon={faUserEdit} />,
  userPlus: <FontAwesomeIcon icon={faUserPlus} />,
  userSlash: <FontAwesomeIcon icon={faUserSlash} />,
  wallet: <FontAwesomeIcon icon={faWallet} />,
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
        width={width ? width : "9"}
        height={height ? height : "13"}
      />
    </svg>
  );
};

export const PaperDiscussionIcon = ({ color }) => {
  return (
    <svg
      width={23}
      height={20}
      viewBox="0 0 25 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.509 1.65c1.894-.004 3.756.44 5.39 1.285s2.982 2.06 3.903 3.52c.921 1.46 1.382 3.11 1.334 4.78-.048 1.67-.602 3.298-1.605 4.715-.242.447-.36.939-.345 1.434.015.495.163.98.432 1.415a13.22 13.22 0 00-1.872-.165c-.58-.021-1.154.1-1.66.352a11.616 11.616 0 01-4.598 1.329 11.918 11.918 0 01-4.79-.61c-1.522-.527-2.886-1.356-3.984-2.423-1.098-1.068-1.902-2.344-2.348-3.73a8.28 8.28 0 01-.224-4.262A8.842 8.842 0 014.09 5.383c.982-1.152 2.253-2.089 3.713-2.736 1.46-.648 3.07-.99 4.706-.998zm0-1.65a13.875 13.875 0 00-5.572 1.144c-1.732.757-3.24 1.858-4.407 3.216C1.363 5.72.57 7.297.214 8.972a9.742 9.742 0 00.262 5.038c.53 1.639 1.483 3.147 2.785 4.405 1.303 1.259 2.92 2.233 4.723 2.847 1.803.613 3.743.85 5.668.69a13.64 13.64 0 005.42-1.613c.212-.082.444-.116.674-.099.73.026 1.457.107 2.172.242 1.522.264 3.057.638 3.057.638a26.203 26.203 0 01-1.41-2.42c-.387-.814-.662-1.584-.462-1.87 1.181-1.666 1.835-3.58 1.893-5.544.058-1.964-.482-3.905-1.563-5.623-1.082-1.718-2.665-3.15-4.586-4.145A13.783 13.783 0 0012.509 0z"
        fill={color ? color : "#AFADB7"}
      />
      <path
        d="M8.328 12.282a1.354 1.354 0 100-2.707 1.354 1.354 0 000 2.707zM12.686 12.282a1.354 1.354 0 100-2.707 1.354 1.354 0 000 2.707zM17.573 12.282a1.354 1.354 0 100-2.707 1.354 1.354 0 000 2.707z"
        fill={color ? color : "#AFADB7"}
      />
    </svg>
  );
};

export const PaperPromotionIcon = ({ color, emptyState }) => {
  if (emptyState) {
    return (
      <svg
        width={25}
        height={23}
        viewBox="0 0 34 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.838 1.186h0c7.927 1.252 13.252 8.472 11.971 16.08-1.281 7.615-8.713 12.833-16.647 11.58C5.235 27.593-.09 20.373 1.19 12.766 2.472 5.148 9.904-.069 17.838 1.185z"
          stroke={color ? color : "#AFADB7"}
          strokeWidth={2}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.16 10.885a.629.629 0 00-.634.622c0 .344.284.623.635.623h.497v3.292L9.3 22.164c-.323.504-.385.936-.186 1.296.2.36.605.54 1.217.54h9.981c.612 0 1.018-.18 1.217-.54.2-.36.137-.792-.186-1.296l-4.358-6.742V12.13h.495c.35 0 .635-.279.635-.623a.629.629 0 00-.635-.622h-4.32zm1.61 1.245h1.108v3.608l.174.264 2.068 2.978h-5.59l2.066-2.978.174-.264V12.13z"
          fill={color ? color : "#AFADB7"}
        />
        <rect
          x={10.81}
          y={7.085}
          width={2.469}
          height={2.422}
          rx={1.211}
          fill={color ? color : "#AFADB7"}
        />
        <rect
          x={16.947}
          y={7.085}
          width={2.469}
          height={2.422}
          rx={1.211}
          fill={color ? color : "#AFADB7"}
        />
        <rect
          x={14.196}
          y={4}
          width={1.904}
          height={1.869}
          rx={0.934}
          fill={color ? color : "#AFADB7"}
        />
        <circle cx={28} cy={6} r={6} fill="#3971FF" />
        <path
          d="M28.469 5.49h2.379v1.026h-2.38V9.21h-1.09V6.516H25V5.49h2.379V3h1.09v2.49z"
          fill="#fff"
        />
      </svg>
    );
  }
  return (
    <svg
      width={25}
      height={23}
      viewBox="0 0 25 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#prefix__clip0)" fill={color ? color : "#AFADB7"}>
        <path d="M1.65 11.005A11.798 11.798 0 017.89.451a11.005 11.005 0 00-1.21 20.657 12.36 12.36 0 01-5.03-10.103z" />
        <path d="M13.89 1.65a9.344 9.344 0 11-9.356 9.355 9.355 9.355 0 019.355-9.354zm0-1.65a11.006 11.006 0 100 22.011A11.006 11.006 0 0013.89 0z" />
        <path d="M17.224 16.145h-6.031a1.706 1.706 0 01-1.508-2.52l1.937-3.577a3.3 3.3 0 00.396-1.585v-.902h-.825a.825.825 0 010-1.65h6.02a.826.826 0 010 1.65h-.782v.957a3.303 3.303 0 00.396 1.585l1.882 3.522a1.705 1.705 0 01-1.497 2.52h.012zm-1.233-1.65h1.233L15.33 10.83a4.974 4.974 0 01-.595-2.367v-.902h-1.1v.902a4.974 4.974 0 01-.595 2.367l-1.937 3.576 4.887.088z" />
        <path d="M16.365 10.18h-4.314v1.651h4.314v-1.65z" />
      </g>
      <defs>
        <clipPath id="prefix__clip0">
          <path fill="#fff" d="M0 0h24.883v22H0z" />
        </clipPath>
      </defs>
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
