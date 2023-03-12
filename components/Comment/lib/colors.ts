import globalColors from "~/config/themes/colors";

const colors = {
  border: globalColors.GREY_LINE(),
  sidebar: {
    background: globalColors.GREY_ICY_BLUE_HUE,
  },
  filters: {
    hover: {
      background: globalColors.LIGHTER_GREY(),
    },
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