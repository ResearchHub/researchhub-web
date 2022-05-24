const colors = {
  BLACK: (opacity = 1) => `rgba(36, 31, 58, ${opacity})`,
  BLUE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`,
  DARK_YELLOW: (opacity = 1) => `rgba(235, 175, 61, ${opacity})`,
  EDITOR_TAG_BACKGROUND: "rgba(232, 181, 4, 0.1)",
  EDITOR_TAG_TEXT: "#E8B504",
  ERROR_BACKGROUND: (opacity = 1) => `rgba(255, 83, 83, ${opacity})`,
  GREEN: (opacity = 1) => `rgba(100, 196, 143, ${opacity})`,
  GREEN: (opacity = 1) => `rgba(30, 207, 49, ${opacity})`,
  GREY_BORDER: "#EBEBEB",
  GREY: (opacity = 1) => `rgba(193, 193, 207, ${opacity})`,
  DARKER_GREY: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
  ICY_BLUE: "#E9EFFF",
  ICY_GREY: "rgb(251, 251, 253)",
  INPUT_BACKGROUND_GREY: "rgba(250, 250, 250, 1)",
  LIGHT_BLUE: (opacity = 1) => `rgba(237, 238, 254, ${opacity})`,
  LIGHT_GREEN: (opacity = 1) => `rgba(236, 249, 235, ${opacity})`,
  LIGHT_GREY_BACKGROUND: "#EDEDED",
  LIGHT_GREY_BORDER: "rgba(39, 39, 39, 0.07)",
  LIGHT_GREY_TEXT: "rgba(36, 31, 58, 0.39)",
  LIGHT_GREY: (opacity = 1) => `rgba(235, 235, 235, ${opacity})`,
  LIGHT_YELLOW: (opacity = 1) => `rgba(253, 249, 237, ${opacity})`,
  LIGHTER_BLUE: (opacity = 1) => `rgb(235,241,255, ${opacity})`,
  LIGHTER_GREY_BACKGROUND: "#F6F6F8",
  LIGHTER_GREY: (opacity = 1) => `rgba(243, 243, 243, ${opacity})`,
  NAVY: (opacity = 1) => `rgba(31, 40, 125, ${opacity})`,
  NEW_BLUE: (opacity = 1) => `rgba(57, 113, 255, ${opacity})`,
  ORANGE: (opacity = 1) => `rgba(255, 109, 0, ${opacity})`,
  ORANGE: (opacity = 1) => `rgba(255, 176, 0, ${opacity})`,
  PASTEL_GREEN_TEXT: "#88cb88",
  PURPLE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`,
  RED: (opacity = 1) => `rgba(255, 45, 45, ${opacity})`,
  TEXT_DARKER_GREY: "#241F3A",
  TEXT_GREY: (opacity = 1) => `rgba(128, 126, 134, ${opacity})`,
  TOOLTIP_BACKGROUND_BLACK: "#E69A8DFF",
  TOOLTIP_TEXT_COLOR_WHITE: "5F4B8BFF",
  YELLOW: (opacity = 1) => `rgba(240, 182, 65, ${opacity})`,
  PLACEHOLDER_CARD_BACKGROUND: "#efefef",
};

export const genericCardColors = {
  BORDER: "#EDEDED",
  BACKGROUND: "#FAFAFA",
};

export const formColors = {
  MESSAGE: colors.BLACK(0.65),
  BACKGROUND: "#F0F0F0",
  BORDER: "#D7D7E3",
  INPUT: "#FBFBFD",
};

export const paperTabColors = {
  FONT: colors.BLACK(0.5),
  HOVER_FONT: colors.BLACK(1),
  SELECTED: colors.BLUE(1),
  BACKGROUND: `rgba(243, 243, 248, 1)`,
};

export const voteWidgetColors = {
  BACKGROUND: `rgba(233, 250, 234, 1)`,
  ARROW: `rgba(210, 210, 218, 1)`,
};

export const discussionPageColors = {
  DIVIDER: `rgba(235, 235, 235, 1)`,
  ICON: "#E7EEFF",
  ICON_HOVER: "rgb(205 219 253)",
};

export const modalColors = {
  SUBTITLE: colors.BLACK(0.65),
};

export const bannerColor = {
  BLUE: "#E9F2FF",
  GREY: "#F2F2F6",
};

export const badgeColors = {
  HOVER: colors.LIGHTER_BLUE(),
  COLOR: colors.BLACK(0.5),
  HOVER_COLOR: colors.BLUE(),
};

export const pillNavColors = {
  primary: {
    filledTextColor: colors.NEW_BLUE(),
    filledBackgroundColor: colors.LIGHTER_BLUE(),
    unfilledTextColor: colors.BLACK(0.6),
    unfilledHoverBackgroundColor: colors.LIGHTER_GREY(),
  },
  secondary: {
    filledTextColor: colors.BLACK(0.9),
    filledBackgroundColor: colors.LIGHTER_GREY(),
  },
};

export const iconColors = {
  BACKGROUND: colors.LIGHT_GREY(),
};

export default colors;
