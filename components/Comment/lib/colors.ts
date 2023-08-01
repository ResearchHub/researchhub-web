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
  dot: globalColors.GREYISH_BLUE(),
  gray: globalColors.BLACK(0.6),
  white: globalColors.WHITE(),
  black02: globalColors.BLACK(0.2),
  placeholder: globalColors.PLACEHOLDER_CARD_BACKGROUND,
  annotation: {
    selected: globalColors.BRIGHT_ORANGE(0.3),
    sharedViaUrl: globalColors.NEW_BLUE(0.25),
    unselected: globalColors.PURE_YELLOW(0.3),
  },
};

export default colors;
