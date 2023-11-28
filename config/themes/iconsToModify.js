import colors, { iconColors } from "~/config/themes/colors";
import { StyleSheet, css } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleLeft,
  faAngleRight,
  faArrowRight,
  faAsterisk,
  faBan,
  faBell,
  faBold,
  faBolt,
  faBookOpen,
  faCaretDown,
  faCaretUp,
  faCaretLeft,
  faCheck,
  faClone,
  faCog,
  faChevronCircleRight,
  faChevronCircleLeft,
  faComment,
  faComments as faCommentsSolid,
  faEdit,
  faExclamationCircle,
  faExclamationTriangle,
  faExternalLinkAlt,
  faFile,
  faCoins as faCoinsSolid,
  faFileAlt as faFileAltSolid,
  faFileImport,
  faFlag,
  faGraduationCap,
  faItalic,
  faLayerGroup,
  faLink,
  faLock,
  faMinus,
  faPlay,
  faPlus as faPlusThick,
  faPlusCircle as faPlusCircleSolid,
  faPlusSquare,
  faPortrait,
  faRedo,
  faShare,
  faShareAlt,
  faSort,
  faStar as faStarFilled,
  faStop,
  faGrid2,
  faThumbsDown as solidThumbsDown,
  faThumbsUp as solidThumbsUp,
  faThumbtack,
  faUnderline,
  faUpload,
  faUser,
  faUserEdit,
  faUserPlus,
  faUsers,
  faCheckDouble,
  faVideo,
  faQuestionCircle as solidQuestion,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import {
  faDiscord,
  faFacebookF,
  faGithub,
  faLinkedinIn,
  faMedium,
  faReddit,
  faSlack,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faArrowToBottom,
  faBracketsCurly,
  faChartNetwork,
  faHome,
  faBooks,
  faCommentCheck,
  faCheckCircle as checkCircleSolid,
  faFileEdit,
  faH1,
  faH2,
  faImagePolaroid,
  faArrowUpRight,
  faListOl,
  faListUl,
  faInbox,
  faLongArrowAltDown,
  faLongArrowAltUp,
  faMousePointer,
  faPencil,
  faQuoteRight,
  faRss,
  faTimesCircle as timesCircleSolid,
  faUserSlash,
  faVideoPlus,
  faShieldAlt,
  faTrash as faTrashSolid,
  faMedal as faMedalSolid,
  faBadgeCheck,
  faUp,
  faDown,
  faComments as faCommentRegular,
  faFileLines as faPaperRegular,
  faPenSquare as faPenSquareRegular,
  faArrowAltToBottom as download,
  faArrowDownToLine,
  faArrowRightToLine,
  faArrowLeftToLine,
  faCommentAltLines as faCommentAltLinesSolid,
  faUndo,
  faTableCells,
  faFontCase,
} from "@fortawesome/pro-solid-svg-icons";
import {
  faAngleDown,
  faAngleUp,
  faArrowAltUp,
  faBars,
  faBat,
  faCalendar,
  faCheckCircle,
  faChevronDown as falChevronDown,
  faComments as faCommentsNoBackground,
  faCopy,
  faGlobe as faGlobeLight,
  faHeartRate,
  faUnlock,
  faExpandArrows,
  faLongArrowLeft,
  faPlus,
  faPlusCircle,
  faSearch,
  faStar as faStarAlt,
  faSignIn,
  faTasksAlt,
  faThumbtack as faThumbtackOutline,
  faTimes,
  faReply,
  faPen,
  faTimesCircle,
  faTrashAlt,
  faBadgeCheck as faBadgeCheckAlt,
  faBookOpen as faBookOpenAlt,
  faInfoCircle as faInfoCircleLight,
  faCommentAltCheck as faCommentLightAltCheck,
  faStarShooting as faStarShootingLight,
} from "@fortawesome/pro-light-svg-icons";
import {
  faArrowAltUp as faArrowAltUpRegular,
  faCalendarDay,
  faChartSimple,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCircleExclamation,
  faClock,
  faCommentDots,
  faEllipsisH,
  faEllipsisV,
  faFileUpload,
  faFlag as faFlagOutline,
  faLightbulb,
  faMedal,
  faMailbox,
  faEnvelope,
  faPlus as faPlusReg,
  faStar as faStarOutline,
  faShareAlt as faShareRegular,
  faWallet,
  faFileLines,
} from "@fortawesome/pro-regular-svg-icons";
import {
  faBook,
  faCoin,
  faCoins,
  faCommentAltDots,
  faCommentAltEdit,
  faCommentAltLines,
  faComments,
  faDotCircle,
  faEye,
  faEyeSlash,
  faFileAlt,
  faFireAlt,
  faGlobeAmericas,
  faImage,
  faInfoCircle,
  faList,
  faMinusCircle,
  faPaperPlane,
  faPenSquare,
  faPlus as faPlusDuo,
  faQuestionCircle,
  faReceipt,
  faShapes,
  faShareSquare,
  faSignOut,
  faSortAmountUpAlt,
  faStarHalf,
  faThumbsDown as opaqueThumbsDown,
  faThumbsUp as opaqueThumbsUp,
  faTrophy,
  faUser as faSimpleUser,
  faUserCircle,
  faToggleOff,
} from "@fortawesome/pro-duotone-svg-icons";
import { breakpoints } from "./screen";

library.add(
  faCircleExclamation,
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faArrowAltUp,
  faArrowDownToLine,
  faArrowUpRight,
  faArrowRight,
  faArrowRightToLine,
  faArrowLeftToLine,
  faArrowToBottom,
  faAsterisk,
  faBan,
  faBars,
  faBell,
  faBold,
  faBolt,
  faBook,
  faBooks,
  faBookOpen,
  faBookOpenAlt,
  faBracketsCurly,
  faCalendar,
  faCalendarDay,
  faCaretDown,
  faCaretUp,
  faChartNetwork,
  faCheck,
  faCheckCircle,
  faCheckDouble,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCog,
  faCoin,
  faCoins,
  faCoinsSolid,
  faCopy,
  faComment,
  faStarShootingLight,
  faCommentAltDots,
  faCommentAltEdit,
  faCommentAltLines,
  faCommentAltLinesSolid,
  faComments,
  faCommentDots,
  faDiscord,
  faDotCircle,
  faDown,
  faEdit,
  faEllipsisH,
  faEnvelope,
  faEllipsisV,
  faExclamationCircle,
  faExclamationTriangle,
  faExpandArrows,
  faExternalLinkAlt,
  faEye,
  faEyeSlash,
  faFacebookF,
  faFile,
  faFileAlt,
  faFileUpload,
  faFireAlt,
  faFlag,
  faFlagOutline,
  faFontCase,
  faGlobeAmericas,
  faGraduationCap,
  faH1,
  faH2,
  faImage,
  faImagePolaroid,
  faInbox,
  faInfoCircle,
  faInfoCircleLight,
  faItalic,
  faLayerGroup,
  falChevronDown,
  faLink,
  faLinkedinIn,
  faList,
  faListOl,
  faListUl,
  faLongArrowAltDown,
  faLongArrowAltUp,
  faLongArrowLeft,
  faMedium,
  faMinus,
  faMinusCircle,
  faMousePointer,
  faPaperPlane,
  faPencil,
  faPenSquare,
  faPlay,
  faPlus,
  faPlusCircle,
  faPlusCircleSolid,
  faPlusDuo,
  faPlusReg,
  faPlusSquare,
  faPlusThick,
  faPortrait,
  faQuestionCircle,
  faQuoteRight,
  faReceipt,
  faReddit,
  faSearch,
  faShare,
  faShareAlt,
  faShareRegular,
  faShareSquare,
  faSignOut,
  faSimpleUser,
  faSlack,
  faSortAmountUpAlt,
  faStarAlt,
  faStarFilled,
  faStarHalf,
  faStarOutline,
  faStop,
  faTableCells,
  faTasksAlt,
  faThumbtack,
  faThumbtackOutline,
  faTimes,
  faTimesCircle,
  faTrashAlt,
  faTrophy,
  faXTwitter,
  faUnderline,
  faUndo,
  faUp,
  faSignIn,
  faUpload,
  faUser,
  faUserCircle,
  faUserEdit,
  faUserPlus,
  faUserSlash,
  faVideo,
  faVideoPlus,
  faWallet,
  opaqueThumbsDown,
  opaqueThumbsUp,
  solidThumbsDown,
  solidThumbsUp,
  faFileLines,
  faMailbox
);

const icons = {
  "info-circle": <i className="fa-duotone fa-info-circle"></i>,
  "info-circle-light": <i className="fa-light fa-info-circle"></i>,
  activtyFeed: <i className="fa-solid fa-rss"></i>,
  angleDown: <i className="fa-light fa-angle-down"></i>,
  angleLeft: <i className="fa-solid fa-angle-left"></i>,
  angleRight: <i className="fa-solid fa-angle-right"></i>,
  angleUp: <i className="fa-light fa-angle-up"></i>,
  arrowRight: <i className="fa-solid fa-arrow-right"></i>,
  arrowUpRight: <i className="fa-solid fa-arrow-up-right"></i>,
  arrowRightToLine: <i className="fa-solid fa-arrow-right-to-line"></i>,
  arrowLeftToLine: <i className="fa-solid fa-arrow-left-to-line"></i>,
  arrowToBottom: <i className="fa-solid fa-arrow-to-bottom"></i>,
  asterisk: <i className="fa-solid fa-asterisk"></i>,
  ban: <i className="fa-solid fa-ban"></i>,
  bat: <i className="fa-light fa-bat"></i>,
  bell: <i className="fa-solid fa-bell"></i>,
  bolt: <i className="fa-solid fa-bolt"></i>,
  book: <i className="fa-duotone fa-book"></i>,
  books: <i className="fa-solid fa-books"></i>,
  bookOpen: <i className="fa-solid fa-book-open"></i>,
  bookOpenAlt: <i className="fa-light fa-book-open-alt"></i>,
  burgerMenu: <i className="fa-light fa-bars"></i>,
  calendar: <i className="fa-light fa-calendar"></i>,
  caretDown: <i className="fa-solid fa-caret-down"></i>,
  caretUp: <i className="fa-solid fa-caret-up"></i>,
  caretLeft: <i className="fa-solid fa-caret-left"></i>,
  chat: <i className="fa-solid fa-comment"></i>,
  check: <i className="fa-solid fa-check"></i>,
  chartSimple: <i className="fa-regular fa-chart-simple"></i>,
  checkCircle: <i className="fa-solid fa-check-circle"></i>,
  checkCircleSolid: <i className="fa-solid fa-check-circle"></i>,
  chevronDown: <i className="fa-regular fa-chevron-down"></i>,
  chevronDownLeft: <i className="fa-light fa-chevron-down"></i>,
  chevronLeft: <i className="fa-regular fa-chevron-left"></i>,
  chevronRight: <i className="fa-regular fa-chevron-right"></i>,
  chevronUp: <i className="fa-regular fa-chevron-up"></i>,
  copy: <i className="fa-light fa-copy"></i>,
  clock: <i className="fa-regular fa-clock"></i>,
  clone: <i className="fa-solid fa-clone"></i>,
  cog: <i className="fa-solid fa-cog"></i>,
  coin: <i className="fa-duotone fa-coin"></i>,
  coins: <i className="fa-solid fa-coins"></i>,
  coinsSolid: <i className="fa-solid fa-coins"></i>,
  commentAltDots: <i className="fa-duotone fa-comment-alt-dots"></i>,
  commentAltEdit: <i className="fa-duotone fa-comment-alt-edit"></i>,
  commentAltLine: <i className="fa-duotone fa-message-lines"></i>,
  commentAltLineSolid: <i className="fa-solid fa-comment-alt-lines"></i>,
  commentCheck: <i className="fa-solid fa-comment-check"></i>,
  commentLightAltCheck: <i className="fa-light fa-comment-alt-check"></i>,
  commentRegular: <i className="fa-regular fa-comment"></i>,
  comments: <i className="fa-solid fa-comments"></i>,
  commentsSolid: <i className="fa-solid fa-comments"></i>,
  commentsAlt: <i className="fa-light fa-comments"></i>,
  commentDots: <i className="fa-regular fa-comment-dots"></i>,
  chevronCircleRight: <i className="fa-solid fa-chevron-circle-right"></i>,
  chevronCircleLeft: <i className="fa-solid fa-chevron-circle-left"></i>,
  checkDouble: <i className="fa-solid fa-check-double"></i>,
  date: <i className="fa-regular fa-calendar-day"></i>,
  discord: <i className="fa-brands fa-discord"></i>,
  downSolid: <i className="fa-solid fa-down"></i>,
  editHub: <i className="fa-solid fa-edit"></i>,
  ellipsisH: <i className="fa-regular fa-ellipsis-h"></i>,
  ellipsisV: <i className="fa-regular fa-ellipsis-v"></i>,
  error: <i className="fa-solid fa-exclamation-triangle"></i>,
  envelope: <i className="fa-regular fa-envelope"></i>,
  exclamationCircle: <i className="fa-solid fa-exclamation-circle"></i>,
  expandArrows: <i className="fa-light fa-expand-arrows"></i>,
  externalLink: <i className="fa-solid fa-external-link-alt"></i>,
  eye: <i className="fa-duotone fa-eye"></i>,
  eyeSlash: <i className="fa-duotone fa-eye-slash"></i>,
  facebook: <i className="fa-brands fa-facebook-f"></i>,
  file: <i className="fa-solid fa-file"></i>,
  fileEdit: <i className="fa-solid fa-file-edit"></i>,
  fileImport: <i className="fa-solid fa-file-import"></i>,
  fileUpload: <i className="fa-regular fa-file-upload"></i>,
  fire: <i className="fa-duotone fa-fire-alt"></i>,
  flag: <i className="fa-solid fa-flag"></i>,
  download: <i className="fa-solid fa-down-to-line"></i>,
  shield: <i className="fa-solid fa-shield-halved"></i>,
  flagOutline: <i className="fa-regular fa-flag"></i>,
  fontCase: <i className="fa-solid fa-font-case"></i>,
  friends: <i className="fa-solid fa-users"></i>,
  github: <i className="fa-brands fa-github"></i>,
  globe: <i className="fa-light fa-globe"></i>,
  globeLight: <i className="fa-light fa-globe"></i>,
  graduationCap: <i className="fa-solid fa-graduation-cap"></i>,
  help: <i className="fa-duotone fa-circle-question"></i>,
  hub: <i className="fa-solid fa-chart-network"></i>,
  home: <i className="fa-solid fa-house"></i>,
  image: <i className="fa-duotone fa-image"></i>,
  layerGroup: <i className="fa-solid fa-layer-group"></i>,
  lightbulb: <i className="fa-regular fa-lightbulb"></i>,
  link: <i className="fa-solid fa-link"></i>,
  linkedIn: <i className="fa-brands fa-linkedin"></i>,
  live: <i className="fa-duotone fa-circle-dot"></i>,
  lock: <i className="fa-solid fa-lock"></i>,
  lockOpen: <i className="fa-light fa-unlock"></i>,
  longArrowDown: <i className="fa-solid fa-arrow-down-long"></i>,
  longArrowLeft: <i className="fa-light fa-arrow-left-long"></i>,
  longArrowUp: <i className="fa-solid fa-arrow-up-long"></i>,
  manage: <i className="fa-light fa-tasks"></i>,
  mailbox: <i className="fa-regular fa-mailbox"></i>,
  medal: <i className="fa-solid fa-medal"></i>,
  medium: <i className="fa-brands fa-medium"></i>,
  minus: <i className="fa-solid fa-minus"></i>,
  minusCircle: <i className="fa-duotone fa-minus-circle"></i>,
  mousePointer: <i className="fa-solid fa-mouse-pointer"></i>,
  opaqueThumbsDown: <i className="fa-duotone fa-thumbs-down"></i>,
  opaqueThumbsUp: <i className="fa-duotone fa-thumbs-up"></i>,
  paper: <i className="fa-solid fa-file"></i>,
  paperPlane: <i className="fa-duotone fa-paper-plane"></i>,
  paperRegular: <i className="fa-regular fa-file-lines"></i>,
  paperAlt: <i className="fa-solid fa-file-lines"></i>,
  pen: <i className="fa-light fa-pen"></i>,
  penSquare: <i className="fa-solid fa-pen-square"></i>,
  pencil: <i className="fa-solid fa-pencil"></i>,
  pin: <i className="fa-solid fa-thumbtack"></i>,
  pinOutline: <i className="fa-light fa-thumbtack"></i>,
  play: <i className="fa-solid fa-play"></i>,
  plus: <i className="fa-solid fa-plus"></i>,
  plusCircle: <i className="fa-solid fa-plus-circle"></i>,
  plusCircleSolid: <i className="fa-solid fa-plus-circle"></i>,
  plusSquare: <i className="fa-solid fa-plus-square"></i>,
  plusThick: <i className="fa-solid fa-plus"></i>,
  portrait: <i className="fa-solid fa-portrait"></i>,
  pulse: <i className="fa-light fa-heart-rate"></i>,
  receipt: <i className="fa-duotone fa-receipt"></i>,
  reddit: <i className="fa-brands fa-reddit"></i>,
  redo: <i className="fa-solid fa-redo"></i>,
  reply: <i className="fa-light fa-reply"></i>,
  search: <i className="fa-light fa-search"></i>,
  shapes: <i className="fa-duotone fa-shapes"></i>,
  share: <i className="fa-solid fa-share"></i>,
  shareAlt: <i className="fa-solid fa-share-alt"></i>,
  shareRegular: <i className="fa-regular fa-share"></i>,
  shareSquare: <i className="fa-duotone fa-share-square"></i>,
  signOut: <i className="fa-duotone fa-sign-out"></i>,
  signIn: <i className="fa-light fa-sign-in"></i>,
  simpleUser: <i className="fa-duotone fa-user"></i>,
  slack: <i className="fa-brands fa-slack"></i>,
  solidThumbsDown: <i className="fa-solid fa-thumbs-down"></i>,
  solidThumbsUp: <i className="fa-solid fa-thumbs-up"></i>,
  sort: <i className="fa-solid fa-sort"></i>,
  sortAmountUpAlt: <i className="fa-duotone fa-sort-amount-up-alt"></i>,
  squares: <i className="fa-solid fa-th-large"></i>,
  starAlt: <i className="fa-light fa-star"></i>,
  starEmpty: <i className="fa-regular fa-star"></i>,
  starFilled: <i className="fa-solid fa-star"></i>,
  starHalf: <i className="fa-duotone fa-star-half"></i>,
  stop: <i className="fa-solid fa-stop"></i>,
  subscribers: <i className="fa-solid fa-user"></i>,
  tableCell: <i className="fa-solid fa-table-cells"></i>,
  takeaway: <i className="fa-duotone fa-list"></i>,
  times: <i className="fa-light fa-times"></i>,
  timesCircle: <i className="fa-solid fa-times-circle"></i>,
  timesCircleSolid: <i className="fa-solid fa-times-circle"></i>,
  trash: <i className="fa-solid fa-trash"></i>,
  trashSolid: <i className="fa-solid fa-trash"></i>,
  trophy: <i className="fa-duotone fa-trophy"></i>,
  twitter: <i className="fa-brands fa-twitter"></i>,
  up: <i className="fa-solid fa-up"></i>,
  upSolid: <i className="fa-solid fa-up"></i>,
  upRegular: <i className="fa-regular fa-arrow-up"></i>,
  upload: <i className="fa-solid fa-upload"></i>,
  question: <i className="fa-solid fa-question"></i>,
  undo: <i className="fa-solid fa-undo"></i>,
  user: <i className="fa-solid fa-user"></i>,
  userEdit: <i className="fa-solid fa-user-edit"></i>,
  userPlus: <i className="fa-solid fa-user-plus"></i>,
  users: <i className="fa-solid fa-users"></i>,
  userSlash: <i className="fa-solid fa-user-slash"></i>,
  verifiedBadge: <i className="fa-solid fa-badge-check"></i>,
  verifiedBadgeAlt: <i className="fa-light fa-badge-check"></i>,
  video: <i className="fa-solid fa-video"></i>,
  toggleOn: <i className="fa-solid fa-toggle-on"></i>,
  toggleOff: <i className="fa-duotone fa-toggle-off"></i>,
  wallet: <i className="fa-regular fa-wallet"></i>,
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
  downvote: <FontAwesomeIcon icon={faDown} />,
  upvote: <FontAwesomeIcon icon={faUp} />,
};

export const textEditorIcons = {
  bold: <FontAwesomeIcon icon={faBold} />,
  bulletedList: <FontAwesomeIcon icon={faListUl} />,
  code: <FontAwesomeIcon icon={faBracketsCurly} />,
  h1: <FontAwesomeIcon icon={faH1} />,
  h1: <FontAwesomeIcon icon={faH2} />,
  image: <FontAwesomeIcon icon={faImagePolaroid} />,
  italic: <FontAwesomeIcon icon={faItalic} />,
  link: <FontAwesomeIcon icon={faLink} />,
  numberedList: <FontAwesomeIcon icon={faListOl} />,
  quote: <FontAwesomeIcon icon={faQuoteRight} />,
  underline: <FontAwesomeIcon icon={faUnderline} />,
  video: <FontAwesomeIcon icon={faVideoPlus} />,
};

export const WarningIcon = (props) => {
  return <FontAwesomeIcon {...props} icon={faCircleExclamation} />;
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

export const PaperDiscussionIcon = ({
  color,
  onClick,
  withAnimation = false,
  overrideStyle = null,
}) => {
  return (
    <span
      onClick={onClick}
      className={css(
        styles.discussionWrapper,
        withAnimation && styles.withAnimation,
        overrideStyle && overrideStyle
      )}
    >
      {icons.chat}
    </span>
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

export function PaperPromotionIconLarge({ color }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.34406 16.188C3.97782 16.188 3.68092 16.479 3.68092 16.838C3.68092 17.1969 3.97782 17.4879 4.34406 17.4879H4.86321V20.9253L0.313369 27.9636C-0.0242333 28.4905 -0.0890862 28.9418 0.118969 29.3173C0.327024 29.6931 0.750675 29.881 1.38983 29.881H11.8104C12.4494 29.881 12.873 29.6931 13.0809 29.3173C13.2891 28.9418 13.2243 28.4906 12.8867 27.9637L8.33657 20.9254V17.4879H8.85343C9.21968 17.4879 9.51657 17.1969 9.51657 16.838C9.51657 16.479 9.21967 16.188 8.85343 16.188H4.34406ZM6.02364 17.4879H7.18133V21.2553L7.36217 21.5305L9.52184 24.6399H3.68618L5.84277 21.5305L6.02364 21.2553V17.4879Z"
        fill={color ? color : "#241F3A"}
        fillOpacity={color ? ".8" : "0.35"}
      />
      <rect
        x="1.89062"
        y="12.2212"
        width="2.57732"
        height="2.52903"
        rx="1.26452"
        fill={color ? color : "#241F3A"}
        fillOpacity={color ? ".8" : "0.35"}
      />
      <rect
        x="8.29688"
        y="12.2212"
        width="2.57732"
        height="2.52903"
        rx="1.26452"
        fill={color ? color : "#241F3A"}
        fillOpacity={color ? ".8" : "0.35"}
      />
      <rect
        x="5.4248"
        y="9"
        width="1.98822"
        height="1.95097"
        rx="0.975484"
        fill={color ? color : "#241F3A"}
        fillOpacity={color ? ".8" : "0.35"}
      />
      <circle cx="22" cy="8" r="8" fill="#3971FF" />
      <path
        d="M21.5 7.5V5C21.5 4.72386 21.7239 4.5 22 4.5C22.2761 4.5 22.5 4.72386 22.5 5V7.5H25C25.2761 7.5 25.5 7.72386 25.5 8C25.5 8.27614 25.2761 8.5 25 8.5H22.5V11C22.5 11.2761 22.2761 11.5 22 11.5C21.7239 11.5 21.5 11.2761 21.5 11V8.5H19C18.7239 8.5 18.5 8.27614 18.5 8C18.5 7.72386 18.7239 7.5 19 7.5H21.5Z"
        fill="white"
      />
    </svg>
  );
}

export function DownloadIcon({ style }) {
  return (
    <img
      className={css(styles.iconDownload, style && style)}
      src={"/static/icons/download.png"}
      alt="Download"
    />
  );
}

export const CloseIcon = ({
  onClick,
  width = 14,
  height = 14,
  withAnimation = true,
  overrideStyle = null,
  color = colors.BLACK(),
}) => {
  return (
    <span
      onClick={onClick}
      className={css(
        styles.iconWrapper,
        withAnimation && styles.withAnimation,
        overrideStyle && overrideStyle
      )}
    >
      <svg
        width={width}
        height={height}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 409.806 409.806"
      >
        {" "}
        <g>
          {" "}
          <g>
            {" "}
            <path
              fill={color}
              d="M228.929,205.01L404.596,29.343c6.78-6.548,6.968-17.352,0.42-24.132c-6.548-6.78-17.352-6.968-24.132-0.42 c-0.142,0.137-0.282,0.277-0.42,0.42L204.796,180.878L29.129,5.21c-6.78-6.548-17.584-6.36-24.132,0.42 c-6.388,6.614-6.388,17.099,0,23.713L180.664,205.01L4.997,380.677c-6.663,6.664-6.663,17.468,0,24.132 c6.664,6.662,17.468,6.662,24.132,0l175.667-175.667l175.667,175.667c6.78,6.548,17.584,6.36,24.132-0.42 c6.387-6.614,6.387-17.099,0-23.712L228.929,205.01z"
            />{" "}
          </g>{" "}
        </g>{" "}
        <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
        <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g>{" "}
      </svg>
    </span>
  );
};

export const PaperIcon = ({
  onClick,
  width = 16,
  height = 16,
  withAnimation = true,
  overrideStyle = null,
  color = "currentColor",
}) => {
  return (
    <span
      onClick={onClick}
      className={css(
        withAnimation && styles.withAnimation,
        overrideStyle && overrideStyle
      )}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 12 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.95019 9.92658H7.54095C7.81158 9.92658 8.036 9.69991 8.036 9.42658C8.036 9.15324 7.81158 8.93324 7.54095 8.93324H3.95019C3.67956 8.93324 3.45514 9.15324 3.45514 9.42658C3.45514 9.69991 3.67956 9.92658 3.95019 9.92658ZM6.18121 5.59991H3.95019C3.67956 5.59991 3.45514 5.82658 3.45514 6.09991C3.45514 6.37324 3.67956 6.59324 3.95019 6.59324H6.18121C6.45184 6.59324 6.67626 6.37324 6.67626 6.09991C6.67626 5.82658 6.45184 5.59991 6.18121 5.59991ZM10.8917 5.01699C11.0469 5.0152 11.2158 5.01325 11.3693 5.01325C11.5343 5.01325 11.6663 5.14659 11.6663 5.31325V10.6733C11.6663 12.3266 10.3396 13.6666 8.70265 13.6666H3.44852C1.73235 13.6666 0.333008 12.2599 0.333008 10.5266V3.33992C0.333008 1.68659 1.66634 0.333252 3.30991 0.333252H6.83466C7.00628 0.333252 7.13829 0.473252 7.13829 0.639919V2.78659C7.13829 4.00659 8.13499 5.00659 9.34291 5.01325C9.62505 5.01325 9.87379 5.01536 10.0915 5.01721C10.2608 5.01864 10.4114 5.01992 10.5442 5.01992C10.6382 5.01992 10.76 5.01851 10.8917 5.01699ZM11.0737 4.04392C10.5311 4.04592 9.89149 4.04392 9.43143 4.03925C8.7014 4.03925 8.10007 3.43192 8.10007 2.69458V0.937249C8.10007 0.649916 8.44529 0.507249 8.64265 0.714582C9.00021 1.09009 9.49171 1.60639 9.98083 2.1202C10.4678 2.6317 10.9523 3.14074 11.3001 3.50592C11.4928 3.70792 11.3516 4.04325 11.0737 4.04392Z"
          fill={color}
        />
      </svg>
    </span>
  );
};

export const PostIcon = ({
  onClick,
  width = 16,
  height = 16,
  withAnimation = true,
  overrideStyle = null,
  color = "currentColor",
}) => {
  return (
    <span
      onClick={onClick}
      className={css(
        withAnimation && styles.withAnimation,
        overrideStyle && overrideStyle
      )}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.1099 1.34014C12.0689 1.2802 13.0146 1.61319 13.7272 2.26585C14.3798 2.97845 14.7128 3.92414 14.6596 4.8898V11.11C14.7195 12.0757 14.3798 13.0214 13.7338 13.734C13.0212 14.3866 12.0689 14.7196 11.1099 14.6597H4.88959C3.92391 14.7196 2.97822 14.3866 2.26561 13.734C1.61295 13.0214 1.27996 12.0757 1.3399 11.11V4.8898C1.27996 3.92414 1.61295 2.97845 2.26561 2.26585C2.97822 1.61319 3.92391 1.2802 4.88959 1.34014H11.1099ZM7.32038 11.2299L11.8024 6.73456C12.2087 6.32166 12.2087 5.65568 11.8024 5.24943L10.9367 4.38366C10.5238 3.97076 9.85777 3.97076 9.44486 4.38366L8.99865 4.83653C8.93205 4.90313 8.93205 5.01634 8.99865 5.08294C8.99865 5.08294 10.0576 6.13518 10.0775 6.16182C10.1508 6.24174 10.1974 6.3483 10.1974 6.46817C10.1974 6.70792 10.0043 6.90772 9.75787 6.90772C9.64466 6.90772 9.5381 6.8611 9.46484 6.78784L8.35265 5.68232C8.29937 5.62904 8.20613 5.62904 8.15285 5.68232L4.97612 8.85903C4.75634 9.07881 4.6298 9.37184 4.62315 9.68484L4.58319 11.2632C4.58319 11.3498 4.60983 11.4297 4.66976 11.4896C4.7297 11.5496 4.80962 11.5829 4.8962 11.5829H6.46126C6.78093 11.5829 7.08728 11.4563 7.32038 11.2299Z"
          fill={color}
        />
      </svg>
    </span>
  );
};

export const QuestionIcon = ({
  color = "currentColor",
  onClick,
  overrideStyle = null,
  size = 16,
  withAnimation = true,
}) => {
  return (
    <span
      className={css(
        withAnimation && styles.withAnimation,
        overrideStyle && overrideStyle
      )}
      onClick={onClick}
      style={{
        fontSize: size,
        color: color,
      }}
    >
      <FontAwesomeIcon icon={faQuestionCircle} />
    </span>
  );
};

export const RSCIcon = ({
  color = "currentColor",
  onClick,
  overrideStyle = null,
  size = 16,
  withAnimation = true,
}) => {
  return (
    <span
      className={css(
        withAnimation && styles.withAnimation,
        overrideStyle && overrideStyle
      )}
      onClick={onClick}
      style={{
        fontSize: size,
        color: color,
      }}
    >
      <img
        src="/static/rsc-icon-gray.png"
        className={css(styles.rscIcon)}
        height="40px"
      />
    </span>
  );
};

export const HypothesisIcon = ({
  onClick,
  width = 16,
  height = 16,
  withAnimation = true,
  overrideStyle = null,
  color = "currentColor",
}) => {
  return (
    <span
      onClick={onClick}
      className={css(
        withAnimation && styles.withAnimation,
        overrideStyle && overrideStyle
      )}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.29446 12C5.09646 11.1513 4.20313 10.4573 3.83646 9.99998C3.20859 9.21551 2.81509 8.26963 2.7013 7.27129C2.58752 6.27296 2.75806 5.26279 3.1933 4.35715C3.62853 3.4515 4.31075 2.68723 5.16137 2.15237C6.01198 1.61751 6.99638 1.33382 8.00118 1.33398C9.00598 1.33415 9.99029 1.61815 10.8407 2.15328C11.6912 2.68841 12.3732 3.4529 12.8081 4.35869C13.243 5.26447 13.4133 6.27469 13.2992 7.27299C13.185 8.27129 12.7913 9.21705 12.1631 10.0013C11.7965 10.458 10.9045 11.152 10.7065 12H5.29379H5.29446ZM10.6671 13.3333V14C10.6671 14.3536 10.5267 14.6927 10.2766 14.9428C10.0266 15.1928 9.68742 15.3333 9.33379 15.3333H6.66713C6.31351 15.3333 5.97437 15.1928 5.72432 14.9428C5.47427 14.6927 5.33379 14.3536 5.33379 14V13.3333H10.6671ZM8.66713 6.66998V3.99998L5.66713 8.00332H7.33379V10.67L10.3338 6.66998H8.66713Z"
          fill={color}
        />
      </svg>
    </span>
  );
};

export const DownIcon = ({
  onClick,
  withAnimation = true,
  overrideStyle = null,
}) => {
  return (
    <span
      onClick={onClick}
      className={css(
        styles.iconWrapper,
        withAnimation && styles.withAnimation,
        overrideStyle && overrideStyle
      )}
    >
      {icons.chevronDown}
    </span>
  );
};

export const UpIcon = ({
  onClick,
  withAnimation = true,
  overrideStyle = null,
}) => {
  return (
    <span
      onClick={onClick}
      className={css(
        styles.iconWrapper,
        withAnimation && styles.withAnimation,
        overrideStyle && overrideStyle
      )}
    >
      {icons.chevronUp}
    </span>
  );
};

export const MedalIcon = ({
  onClick = undefined,
  overrideStyle = null,
  width = 25,
  height = 25,
  color = colors.BLACK(),
}) => {
  return (
    <span onClick={onClick} className={css(overrideStyle && overrideStyle)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 20 16`}
        fill="none"
        id={"medalIcon"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.99967 4.83547C8.76778 4.83547 10.4635 5.53785 11.7137 6.78809C12.964 8.03833 13.6663 9.73403 13.6663 11.5021C13.6663 13.2702 12.964 14.9659 11.7137 16.2162C10.4635 17.4664 8.76778 18.1688 6.99967 18.1688C5.23156 18.1688 3.53587 17.4664 2.28563 16.2162C1.03539 14.9659 0.333008 13.2702 0.333008 11.5021C0.333008 9.73403 1.03539 8.03833 2.28563 6.78809C3.53587 5.53785 5.23156 4.83547 6.99967 4.83547ZM6.99967 6.50213C5.67359 6.50213 4.40182 7.02892 3.46414 7.9666C2.52646 8.90428 1.99967 10.1761 1.99967 11.5021C1.99967 12.8282 2.52646 14.1 3.46414 15.0377C4.40182 15.9753 5.67359 16.5021 6.99967 16.5021C8.32576 16.5021 9.59753 15.9753 10.5352 15.0377C11.4729 14.1 11.9997 12.8282 11.9997 11.5021C11.9997 10.1761 11.4729 8.90428 10.5352 7.9666C9.59753 7.02892 8.32576 6.50213 6.99967 6.50213ZM6.99967 7.75214L8.10217 9.98547L10.5663 10.3438L8.78301 12.0813L9.20384 14.5363L6.99967 13.3771L4.79551 14.5355L5.21634 12.0813L3.43301 10.343L5.89717 9.98463L6.99967 7.75214ZM11.9997 0.668802V3.1688L10.8638 4.11714C9.92129 3.62262 8.89223 3.3145 7.83301 3.20964V0.668802H11.9997ZM6.16634 0.667969V3.20964C5.10746 3.31434 4.07869 3.62218 3.13634 4.1163L1.99967 3.1688V0.668802L6.16634 0.667969Z"
          fill={color}
        />
      </svg>
    </span>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 8,
    marginLeft: 8,
    display: "inline-flex",
  },
  mobile: {
    [`@media only screen and (min-width: ${breakpoints.large.int - 1}px)`]: {
      display: "none",
    },
  },
  desktop: {
    display: "none",
    [`@media only screen and (min-width: ${breakpoints.large.str})`]: {
      display: "block",
    },
  },
  discussionWrapper: {
    padding: 3,
    display: "inline-flex",
  },
  withAnimation: {
    ":hover": {
      background: iconColors.BACKGROUND,
      borderRadius: 3,
      transition: "0.3s",
    },
  },
  closeIcon: {
    fontWeight: 200,
    transform: "rotate(45deg)",
    fontSize: 36,
    color: "black",
    display: "inline-block",
  },

  coinStack: {},
  iconPartyPopper: {
    height: 15,
  },
  iconRSC: {
    height: 15,
  },
  iconDownload: {
    height: 16,
  },
});

export default icons;
