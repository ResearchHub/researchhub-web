// themes/dark.js
import colors from "~/config/themes/colors";

const dark = {
  id: "dark",
  BLACK: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Inverted
  BLACK_TEXT: (opacity = 1) => `rgba(191, 191, 191, ${opacity})`, // Lightened
  BLUE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`, // Unchanged
  DARK_GREEN: (opacity = 1) => `rgba(94, 102, 67, ${opacity})`, // Darkened
  DARK_YELLOW: (opacity = 1) => `rgba(120, 95, 0, ${opacity})`, // Darkened
  DARKER_GREY: (opacity = 1) => `rgba(153, 153, 153, ${opacity})`, // Lightened
  EDITOR_TAG_BACKGROUND: "rgba(23, 74, 251, 0.1)", // Adjusted
  EDITOR_TAG_TEXT: "#1722FB", // Adjusted
  ERROR_BACKGROUND: (opacity = 1) => `rgba(255, 83, 83, ${opacity})`, // Unchanged
  GREEN: (opacity = 1) => `rgba(155, 59, 207, ${opacity})`, // Adjusted
  GREY_BORDER: "#141414", // Darkened
  GREY_ICY_BLUE_HUE: "rgba(6, 6, 3, 1)", // Darkened
  GREY_LINE: (opacity = 1) => `rgba(23, 23, 16, ${opacity})`, // Darkened
  GREY: (opacity = 1) => `rgba(62, 62, 48, ${opacity})`, // Darkened
  ICY_BLUE: "#161900", // Darkened
  ICY_GREY: "rgb(4, 4, 2)", // Darkened
  INPUT_BACKGROUND_GREY: "rgba(5, 5, 5, 1)", // Darkened
  LIGHT_GRAY_BACKGROUND: (opacity = 1) => `rgba(5, 5, 5, ${opacity})`, // Darkened
  LIGHT_BLUE: (opacity = 1) => `rgba(18, 17, 1, ${opacity})`, // Darkened
  LIGHT_GREEN: (opacity = 1) => `rgba(19, 6, 20, ${opacity})`, // Adjusted
  LIGHT_GREY_BACKGROUND: "#121212", // Darkened
  LIGHT_GREY_BORDER: "rgba(216, 216, 216, 0.07)", // Unchanged
  LIGHT_GREY_TEXT: "rgba(219, 224, 195, 0.39)", // Adjusted
  LIGHT_GREY: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`, // Darkened
  LIGHT_YELLOW: (opacity = 1) => `rgba(2, 6, 18, ${opacity})`, // Darkened
  LIGHTER_BLUE: (opacity = 1) => `rgb(20, 14, 0, ${opacity})`, // Darkened
  LIGHTER_GREY_BACKGROUND: "#090909", // Darkened
  LIGHTER_GREY: (opacity = 1) => `rgba(12, 12, 12, ${opacity})`, // Darkened
  MEDIUM_GREY: (opacity = 1) => `rgba(111, 111, 111, ${opacity})`, // Lightened
  MEDIUM_GREY2: (opacity = 1) => `rgb(131,134,118, ${opacity})`, // Adjusted
  NAVY: (opacity = 1) => `rgba(224, 215, 130, ${opacity})`, // Adjusted
  NEW_BLUE: (opacity = 1) => `rgba(198, 142, 0, ${opacity})`, // Adjusted
  NEW_GREEN: (opacity = 1) => `rgba(183, 63, 170, ${opacity})`, // Adjusted
  ORANGE_DARK: (opacity = 1) => `rgba(18, 98, 235, ${opacity})`, // Adjusted
  ORANGE_DARK2: (opacity = 1) => `rgba(0, 133, 255, ${opacity})`, // Adjusted
  ORANGE_LIGHT: (opacity = 1) => `rgb(0, 60, 194, ${opacity})`, // Adjusted
  ORANGE_LIGHT2: (opacity = 1) => `rgb(0, 107, 233, ${opacity})`, // Adjusted
  ORANGE: (opacity = 1) => `rgba(15, 79, 255, ${opacity})`, // Adjusted
  ORANGE_LIGHTER: (opacity = 1) => `rgb(3, 13, 35, ${opacity})`, // Darkened
  PASTEL_GREEN_TEXT: "#773877", // Adjusted
  PLACEHOLDER_CARD_BACKGROUND: "#101010", // Darkened
  PURPLE_LIGHT: (opacity = 1) => `rgb(143, 195, 0, ${opacity})`, // Adjusted
  PURPLE: (opacity = 1) => `rgba(177, 172, 0, ${opacity})`, // Adjusted
  RED: (opacity = 1) => `rgba(255, 210, 210, ${opacity})`, // Lightened
  STANDARD_BOX_SHADOW: "rgba(70, 70, 70, 0.25)", // Adjusted
  TEXT_DARKER_GREY: "#DBE0C5", // Adjusted
  TEXT_GREY: (opacity = 1) => `rgba(127, 129, 121, ${opacity})`, // Adjusted
  TOOLTIP_BACKGROUND_BLACK: "#196758FF", // Adjusted
  TOOLTIP_TEXT_COLOR_WHITE: "A0B4B9FF", // Adjusted
  YELLOW: (opacity = 1) => `rgba(15, 73, 190, ${opacity})`, // Adjusted
};

// export const bountyColors = {
//   BADGE_TEXT: colors.ORANGE_DARK2(1),
//   BADGE_BACKGROUND: colors.ORANGE_LIGHTER(),
// };

export const darkBountyColors = {
  BADGE_TEXT: colors.ORANGE_LIGHT2(1),
  BADGE_BACKGROUND: colors.ORANGE_DARK2(1),
};

// export const genericCardColors = {
//   BORDER: "#EDEDED",
//   BACKGROUND: "#FAFAFA",
// };

export const darkGenericCardColors = {
  BORDER: "#141414",
  BACKGROUND: "#1A1A1A",
};

// export const formColors = {
//   MESSAGE: colors.BLACK(0.65),
//   BACKGROUND: "#F0F0F0",
//   BORDER: "#D7D7E3",
//   INPUT: "#FBFBFD",
// };

export const darkFormColors = {
  MESSAGE: colors.WHITE(0.85),
  BACKGROUND: "#1A1A1A",
  BORDER: "#282828",
  INPUT: "#222222",
};

// export const paperTabColors = {
//   FONT: colors.BLACK(0.5),
//   HOVER_FONT: colors.BLACK(1),
//   SELECTED: colors.BLUE(1),
//   BACKGROUND: `rgba(243, 243, 248, 1)`,
// };

export const darkPaperTabColors = {
  FONT: colors.WHITE(0.7),
  HOVER_FONT: colors.WHITE(1),
  SELECTED: colors.BLUE(1),
  BACKGROUND: `rgba(30, 30, 35, 1)`,
};

// export const voteWidgetColors = {
//   BACKGROUND: `rgba(233, 250, 234, 1)`,
//   ARROW: `#AAA8B4`,
// };

export const darkVoteWidgetColors = {
  BACKGROUND: `rgba(22, 5, 21, 1)`,
  ARROW: `#5F5C70`,
};

// export const discussionPageColors = {
//   DIVIDER: `rgba(235, 235, 235, 1)`,
//   ICON: "#E7EEFF",
//   ICON_HOVER: "rgb(205 219 253)",
// };

export const darkDiscussionPageColors = {
  DIVIDER: `rgba(40, 40, 40, 1)`,
  ICON: "#1A1A1A",
  ICON_HOVER: "rgb(50, 60, 70)",
};

// export const modalColors = {
//   SUBTITLE: colors.BLACK(0.65),
// };

export const darkModalColors = {
  SUBTITLE: colors.WHITE(0.85),
};

// export const bannerColor = {
//   BLUE: "#E9F2FF",
//   GREY: "#F2F2F6",
// };

export const darkBannerColor = {
  BLUE: "#1A1A2E",
  GREY: "#1A1A1A",
};

// export const badgeColors = {
//   HOVER: colors.LIGHTER_BLUE(),
//   COLOR: colors.BLACK(0.5),
//   HOVER_COLOR: colors.BLUE(),
// };

export const darkBadgeColors = {
  HOVER: colors.PURE_BLUE(),
  COLOR: colors.WHITE(0.7),
  HOVER_COLOR: colors.BLUE(),
};

// export const pillNavColors = {
//   primary: {
//     filledTextColor: colors.NEW_BLUE(),
//     filledBackgroundColor: colors.LIGHTER_BLUE(),
//     unfilledTextColor: colors.BLACK(0.6),
//     unfilledHoverBackgroundColor: colors.LIGHTER_GREY(),
//   },
//   secondary: {
//     filledTextColor: colors.BLACK(0.9),
//     filledBackgroundColor: colors.LIGHTER_GREY(),
//   },
// };

export const darkPillNavColors = {
  primary: {
    filledTextColor: colors.LIGHT_BLUE(),
    filledBackgroundColor: colors.PURE_BLUE(),
    unfilledTextColor: colors.WHITE(0.7),
    unfilledHoverBackgroundColor: colors.DARKER_GREY(),
  },
  secondary: {
    filledTextColor: colors.WHITE(0.85),
    filledBackgroundColor: colors.DARKER_GREY(),
  },
};

// export const iconColors = {
//   BACKGROUND: colors.LIGHT_GREY(),
// };

export const darkIconColors = {
  BACKGROUND: colors.DARKER_GREY(),
};

export default dark;
