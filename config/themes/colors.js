const colors = {
  BLACK: (opacity = 1) => `rgba(36, 31, 58, ${opacity})`,
  BLUE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`,
  DARK_YELLOW: (opacity = 1) => `rgba(235, 175, 61, ${opacity})`,
  GREEN: (opacity = 1) => `rgba(100, 196, 143, ${opacity})`,
  GREEN: (opacity = 1) => `rgba(30, 207, 49, ${opacity})`,
  GREY: (opacity = 1) => `rgba(193, 193, 207, ${opacity})`,
  ICY_BLUE: "#E9EFFF",
  ICY_GREY: "rgb(251, 251, 253)",
  LIGHT_BLUE: (opacity = 1) => `rgba(237, 238, 254, ${opacity})`,
  LIGHT_GREEN: (opacity = 1) => `rgba(236, 249, 235, ${opacity})`,
  LIGHT_GREY_BACKGROUND: "#EDEDED",
  LIGHT_GREY_BORDER: "rgba(39, 39, 39, 0.07)",
  LIGHT_GREY_TEXT: "rgba(36, 31, 58, 0.39)",
  LIGHT_GREY: (opacity = 1) => `rgba(242, 242, 246, ${opacity})`,
  LIGHT_YELLOW: (opacity = 1) => `rgba(253, 249, 237, ${opacity})`,
  NAVY: (opacity = 1) => `rgba(31, 40, 125, ${opacity})`,
  NEW_BLUE: (opacity = 1) => `rgba(57, 113, 255, ${opacity})`,
  ORANGE: (opacity = 1) => `rgba(255, 109, 0, ${opacity})`,
  ORANGE: (opacity = 1) => `rgba(255, 176, 0, ${opacity})`,
  PURPLE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`,
  RED: (opacity = 1) => `rgba(255, 45, 45, ${opacity})`,
  TEXT_DARKER_GREY: "#241F3A",
  TEXT_GREY: (opacity = 1) => `rgba(128, 126, 134, ${opacity})`,
  YELLOW: (opacity = 1) => `rgba(240, 182, 65, ${opacity})`,
  WHITE: "#FFFFFF",
};

export const genericCardColors = {
  BORDER: "#EDEDED",
  BACKGROUND: "#FAFAFA",
};

export const formColors = {
  MESSAGE: colors.BLACK(0.65),
  BACKGROUND: "#F0F0F0",
  BORDER: "#D7D7E3",
  SELECT: "#FAFAFA",
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
};

export const modalColors = {
  SUBTITLE: colors.BLACK(0.65),
};

export const bannerColor = {
  BLUE: "#E9F2FF",
  GREY: "#F2F2F6",
};

export const iconColors = {
  BACKGROUND: colors.LIGHT_GREY(),
};

export default colors;
