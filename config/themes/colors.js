const colors = {
  BLACK: (opacity = 1) => `rgba(36, 31, 58, ${opacity})`,
  WHITE: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  BLACK_TEXT: (opacity = 1) => `rgba(64, 64, 64, ${opacity})`,
  BLUE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`,
  DARK_GREEN: (opacity = 1) => `rgba(61, 143, 88, ${opacity})`,
  DARK_YELLOW: (opacity = 1) => `rgb(239, 160, 0, ${opacity})`,
  DARK_YELLOW: (opacity = 1) => `rgba(235, 175, 61, ${opacity})`,
  DARKER_GREY: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
  GREY_HEADING: (opacity = 1) => `rgba(90, 90, 90, ${opacity})`,
  GREY_TEXT: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
  EDITOR_TAG_BACKGROUND: "rgba(232, 181, 4, 0.1)",
  EDITOR_TAG_TEXT: "#E8B504",
  ERROR_BACKGROUND: (opacity = 1) => `rgba(255, 83, 83, ${opacity})`,
  GREEN: (opacity = 1) => `rgba(100, 196, 143, ${opacity})`,
  GREEN: (opacity = 1) => `rgba(30, 207, 49, ${opacity})`,
  PASTEL_GREEN: (opacity = 1) => `rgba(115, 205, 158, ${opacity})`,
  GREY_BORDER: "#EBEBEB",
  GREY_ICY_BLUE_HUE: "rgba(249, 249, 252, 1)",
  GREY_LINE: (opacity = 1) => `rgba(232, 232, 239, ${opacity})`,
  GREY: (opacity = 1) => `rgba(193, 193, 207, ${opacity})`,
  ICY_BLUE: "#E9EFFF",
  ICY_GREY: "rgb(251, 251, 253)",
  INPUT_BACKGROUND_GREY: "rgba(250, 250, 250, 1)",
  LIGHT_GRAY_BACKGROUND: (opacity = 1) => `rgba(250, 250, 250, ${opacity})`,
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
  MEDIUM_GREY: (opacity = 1) => `rgba(144, 144, 144, ${opacity})`,
  MEDIUM_GREY2: (opacity = 1) => `rgb(124,121,137, ${opacity})`,
  NAVY: (opacity = 1) => `rgba(31, 40, 125, ${opacity})`,
  NEW_BLUE: (opacity = 1) => `rgba(57, 113, 255, ${opacity})`,
  NEW_BLUE_HEX: "#3971FF",
  NEW_GREEN: (opacity = 1) => `rgba(72, 192, 85, ${opacity})`,
  ORANGE_DARK: (opacity = 1) => `rgba(237, 157, 20, ${opacity})`,
  ORANGE_DARK2: (opacity = 1) => `rgba(255, 122, 0, ${opacity})`,
  ORANGE_LIGHT: (opacity = 1) => `rgb(255, 195, 61, ${opacity})`,
  ORANGE_LIGHT2: (opacity = 1) => `rgb(255, 148, 22, ${opacity})`,
  ORANGE: (opacity = 1) => `rgba(255, 176, 0, ${opacity})`,
  ORANGE_LIGHTER: (opacity = 1) => `rgb(252, 242, 220, ${opacity})`,
  PASTEL_GREEN_TEXT: "#88cb88",
  PLACEHOLDER_CARD_BACKGROUND: "#efefef",
  PURPLE_LIGHT: (opacity = 1) => `rgb(112, 60, 255, ${opacity})`,
  PURPLE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`,
  RED: (opacity = 1) => `rgba(255, 45, 45, ${opacity})`,
  RED_DARK: (opacity = 1) => `rgba(219, 57, 76, ${opacity})`,
  PASTEL_RED: (opacity = 1) => `rgba(255, 118, 118, ${opacity})`,
  STANDARD_BOX_SHADOW: "rgba(185, 185, 185, 0.25)",
  TEXT_DARKER_GREY: "#241F3A",
  TEXT_GREY: (opacity = 1) => `rgba(128, 126, 134, ${opacity})`,
  TOOLTIP_BACKGROUND_BLACK: "#E69A8DFF",
  TOOLTIP_TEXT_COLOR_WHITE: "5F4B8BFF",
  YELLOW: (opacity = 1) => `rgba(240, 182, 65, ${opacity})`,
};

export const bountyColors = {
  BADGE_TEXT: colors.ORANGE_DARK2(1),
  BADGE_BACKGROUND: colors.ORANGE_LIGHTER(),
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
  ARROW: `#AAA8B4`,
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
