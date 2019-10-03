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

export default colors;
