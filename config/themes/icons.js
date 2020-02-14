import React from "react";
import { StyleSheet, css } from "aphrodite";

const icons = {
  chat: <i className="fas fa-comment"></i>,
  chevronRight: <i className="far fa-chevron-right"></i>,
  longArrowLeft: <i className="fal fa-long-arrow-left"></i>,
  share: <i className="fas fa-share"></i>,
  shareAlt: <i className="fas fa-share-alt"></i>,
  burgerMenu: <i className="fal fa-bars"></i>,
  home: <i className="fad fa-home"></i>,
  help: <i className="fad fa-question-circle"></i>,
  hub: <i className="fad fa-chart-network"></i>,
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
};

export const RHLogo = ({ iconStyle }) => {
  return (
    <img
      src={"/static/ResearchHubLogo.png"}
      className={css(styles.logo, iconStyle && iconStyle)}
      draggable={false}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 40,
  },
});

export default icons;
