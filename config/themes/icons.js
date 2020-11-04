import React from "react";
import { StyleSheet, css } from "aphrodite";

const icons = {
  chat: <i className="fas fa-comment"></i>,
  externalLink: <i className="fas fa-external-link-alt"></i>,
  longArrowLeft: <i className="fal fa-long-arrow-left"></i>,
  share: <i className="fas fa-share"></i>,
  shareAlt: <i className="fas fa-share-alt"></i>,
  burgerMenu: <i className="fal fa-bars"></i>,
  home: <i className="fad fa-home"></i>,
  help: <i className="fad fa-question-circle"></i>,
  hub: <i className="fas fa-chart-network"></i>,
  "info-circle": <i className="fad fa-info-circle"></i>,
  addPaper: <i className="fad fa-file-upload"></i>,
  signOut: <i className="fad fa-sign-out"></i>,
  user: <i className="fad fa-user-circle"></i>,
  simpleUser: <i className="fad fa-user" />,
  file: <i className="fad fa-file-alt" />,
  coins: <i className="fad fa-coins"></i>,
  live: <i className="fas fa-bell"></i>,
  flag: <i className="fas fa-flag" />,
  badge: <i className="fas fa-certificate" />,
  minusCircle: <i className="fad fa-minus-circle" />,
  ellipsisH: <i className="far fa-ellipsis-h" />,
  date: <i className="far fa-calendar-day" />,
  upload: <i className="fas fa-upload"></i>,
  plusCircle: <i className="fal fa-plus-circle" />,
  play: <i className="fas fa-play" />,
  stop: <i className="fas fa-stop" />,
  chevronLeft: <i className="far fa-chevron-left"></i>,
  chevronRight: <i className="far fa-chevron-right"></i>,
  chevronDown: <i className="far fa-chevron-down" />,
  chevronUp: <i className="far fa-chevron-up" />,
  bell: <i className="fas fa-bell" />,
  pencil: <i className="fas fa-pencil" />,
  trophy: <i className={"fad fa-trophy"} />,
  checkCircle: <i className="fal fa-check-circle" />,
  bolt: <i className="fas fa-bolt" />,
  subscribers: <i className="fa fa-user" />,
  paper: <i className="fa fa-file" />,
  editHub: <i className="fas fa-edit" />,
  trash: <i className="fal fa-trash-alt"></i>,
  ban: <i className="fas fa-ban" />,
};

export const voteWidgetIcons = {
  upvote: <i className="fas fa-caret-up"></i>,
  downvote: <i className="fas fa-caret-down"></i>,
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
});

export default icons;
