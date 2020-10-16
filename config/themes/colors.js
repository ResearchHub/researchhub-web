const colors = {
  BLACK: (opacity = 1) => `rgba(36, 31, 58, ${opacity})`,
  BLUE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`,
  PURPLE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`,
  GREY: (opacity = 1) => `rgba(193, 193, 207, ${opacity})`,
  LIGHT_GREY: (opacity = 1) => `rgba(242, 242, 246, ${opacity})`,
  GREEN: (opacity = 1) => `rgba(30, 207, 49, ${opacity})`,
  LIGHT_GREEN: (opacity = 1) => `rgba(236, 249, 235, ${opacity})`,
  LIGHT_BLUE: (opacity = 1) => `rgba(237, 238, 254, ${opacity})`,
  ORANGE: (opacity = 1) => `rgba(255, 109, 0, ${opacity})`,
  RED: (opacity = 1) => `rgba(255, 45, 45, ${opacity})`,
  LIGHT_YELLOW: (opacity = 1) => `rgba(253, 249, 237, ${opacity})`,
  YELLOW: (opacity = 1) => `rgba(240, 182, 65, ${opacity})`,
  DARK_YELLOW: (opacity = 1) => `rgba(235, 175, 61, ${opacity})`,
  NAVY: (opacity = 1) => `rgba(31, 40, 125, ${opacity})`,
  GREEN: (opacity = 1) => `rgba(100, 196, 143, ${opacity})`,
  NEW_BLUE: (opacity = 1) => `rgba(57, 113, 255, ${opacity})`,
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

export const cardColors = {
  BACKGROUND: "#FAFAFA",
  BORDER: "#F0F0F0",
};

export default colors;
