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
  sidebar: {
    background: globalColors.GREY_ICY_BLUE_HUE,
  },
  filters: {
    unselected: {
      text: globalColors.BLACK(0.6),
    },
    selected: {
      background: globalColors.NEW_BLUE(0.1),
      text: globalColors.NEW_BLUE(1.0),
    }
  },
  toggle: {
    commentIcon: globalColors.MEDIUM_GREY(1.0),
    commentText: globalColors.BLACK(0.6),
    bountyText: globalColors.ORANGE_DARK2(1.0),
  },
  bounty: {
    text: globalColors.ORANGE_DARK2(1.0),
  },
  dot: "rgb(200 200 202)",
}

export default colors;