import globalColors from "~/config/themes/colors";

const colors = {
  border: globalColors.GREY_LINE(1.0),
  primary: {
    btn: globalColors.NEW_BLUE(1.0),
    text: globalColors.BLACK(1.0),
  },
  secondary: {
    text: globalColors.BLACK(0.6),
  },
  hover: {
    background: globalColors.LIGHTER_GREY(1.0),
  },
  filters: {
    unselected: {
      text: globalColors.BLACK(0.9),
    },
    selected: {
      background: globalColors.LIGHTER_GREY(1.0),
      text: globalColors.BLACK(0.9),
    },
    divider: globalColors.GREY_LINE(1.0),
  },
  toggle: {
    commentIcon: globalColors.MEDIUM_GREY(1.0),
    commentText: globalColors.BLACK(0.6),
    bountyText: globalColors.ORANGE_DARK2(1.0),
  },
  bounty: {
    btn: globalColors.ORANGE_DARK2(1.0),
    contributeBtn: globalColors.ORANGE_LIGHT2(1.0),
    text: globalColors.ORANGE_DARK2(1.0),
    background: globalColors.ORANGE_LIGHTER(0.6),
  },
  avatar: {
    background: globalColors.LIGHT_GREY(1.0),
  },
  privacyBadge: {
    background: globalColors.NEW_BLUE(0.1),
    color: globalColors.NEW_BLUE(1.0),
  },
  actionBtn: {
    hover: globalColors.NEW_BLUE(0.1),
  },
  dot: "rgb(200 200 202)",
  gray: globalColors.BLACK(0.6),
  placeholder: globalColors.PLACEHOLDER_CARD_BACKGROUND,
  annotation: {
    selected: "rgb(255, 187, 41, 0.75)",
    sharedViaUrl: `rgba(57, 113, 255, 0.25)`,
    unselected: "rgba(255,215,0,0.15)",
  },
};

export default colors;
