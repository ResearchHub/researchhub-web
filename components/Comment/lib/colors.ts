import globalColors from "~/config/themes/colors";

const colors = {
  border: globalColors.GREY_LINE(1.0),
  primary: {
    btn: globalColors.NEW_BLUE(1.0),
    text: globalColors.BLACK(1.0),
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
  }
}

export default colors;