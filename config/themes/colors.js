let colors = {
  BLACK: (opacity = 1) => `rgba(36, 31, 58, ${opacity})`, // #241F3A
  BLACK_TEXT: (opacity = 1) => `rgba(64, 64, 64, ${opacity})`, // #404040
  BLUE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`, // #4E53FF
  DARK_GREEN: (opacity = 1) => `rgba(61, 143, 88, ${opacity})`, // #3D8F58
  DARK_YELLOW: (opacity = 1) => `rgb(239, 160, 0, ${opacity})`, // #EFA000
  DARK_YELLOW: (opacity = 1) => `rgba(235, 175, 61, ${opacity})`,
  DARKER_GREY: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
  EDITOR_TAG_BACKGROUND: "rgba(232, 181, 4, 0.1)",
  EDITOR_TAG_TEXT: "#E8B504", //rgba(232, 181, 4, 1)
  ERROR_BACKGROUND: (opacity = 1) => `rgba(255, 83, 83, ${opacity})`,
  GREEN: (opacity = 1) => `rgba(100, 196, 143, ${opacity})`,
  GREEN: (opacity = 1) => `rgba(30, 207, 49, ${opacity})`,
  GREY_BORDER: "#EBEBEB", //rgba(232, 232, 239, 1)
  GREY_ICY_BLUE_HUE: "rgba(249, 249, 252, 1)", // #F9F9FC
  GREY_LINE: (opacity = 1) => `rgba(232, 232, 239, ${opacity})`,
  GREY: (opacity = 1) => `rgba(193, 193, 207, ${opacity})`,
  ICY_BLUE: "#E9EFFF", // rgba(233, 239, 255, 1)
  ICY_GREY: "rgb(251, 251, 253)",
  INPUT_BACKGROUND_GREY: "rgba(250, 250, 250, 1)",
  LIGHT_GRAY_BACKGROUND: (opacity = 1) => `rgba(250, 250, 250, ${opacity})`,
  LIGHT_GRAY_BACKGROUND2: (opacity = 1) => `rgba(250, 250, 252, ${opacity})`, // #fafafc
  LIGHT_BLUE: (opacity = 1) => `rgba(237, 238, 254, ${opacity})`,
  LIGHT_GREEN: (opacity = 1) => `rgba(236, 249, 235, ${opacity})`,
  LIGHT_GREY_BACKGROUND: "#EDEDED", // rgba(237, 237, 237, 1)
  LIGHT_GREY_BORDER: "rgba(39, 39, 39, 0.07)",
  LIGHT_GREY_TEXT: "rgba(36, 31, 58, 0.39)",
  LIGHT_GREY: (opacity = 1) => `rgba(235, 235, 235, ${opacity})`,
  LIGHT_GREY2: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`, // #EAEAEA
  LIGHT_YELLOW: (opacity = 1) => `rgba(253, 249, 237, ${opacity})`,
  LIGHTER_BLUE: (opacity = 1) => `rgb(235,241,255, ${opacity})`,
  LIGHTER_GREY_BACKGROUND: "#F6F6F8", // rgba(246, 246, 248, 1)
  LIGHTER_GREY: (opacity = 1) => `rgba(243, 243, 243, ${opacity})`,
  MEDIUM_GREY: (opacity = 1) => `rgba(144, 144, 144, ${opacity})`,
  MEDIUM_GREY2: (opacity = 1) => `rgb(124,121,137, ${opacity})`,
  NAVY: (opacity = 1) => `rgba(31, 40, 125, ${opacity})`,
  NEW_BLUE: (opacity = 1) => `rgba(57, 113, 255, ${opacity})`, // #3971ff
  NEW_GREEN: (opacity = 1) => `rgba(72, 192, 85, ${opacity})`,
  ORANGE_DARK: (opacity = 1) => `rgba(237, 157, 20, ${opacity})`,
  ORANGE_DARK2: (opacity = 1) => `rgba(255, 122, 0, ${opacity})`,
  ORANGE_LIGHT: (opacity = 1) => `rgb(255, 195, 61, ${opacity})`,
  ORANGE_LIGHT2: (opacity = 1) => `rgb(255, 148, 22, ${opacity})`,
  ORANGE: (opacity = 1) => `rgba(255, 176, 0, ${opacity})`,
  ORANGE_LIGHTER: (opacity = 1) => `rgb(252, 242, 220, ${opacity})`,
  PASTEL_GREEN_TEXT: "#88cb88", //rgba(136, 203, 136, 1)
  PLACEHOLDER_CARD_BACKGROUND: "#efefef", //rgba(239, 239, 239, 1)
  PURPLE_LIGHT: (opacity = 1) => `rgb(112, 60, 255, ${opacity})`,
  PURPLE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`,
  RED: (opacity = 1) => `rgba(255, 45, 45, ${opacity})`,
  STANDARD_BOX_SHADOW: "rgba(185, 185, 185, 0.25)",
  TEXT_DARKER_GREY: "#241F3A", //rgba(36, 31, 58, 1)
  TEXT_GREY: (opacity = 1) => `rgba(128, 126, 134, ${opacity})`,
  TOOLTIP_BACKGROUND_BLACK: "#E69A8DFF", //rgba(230, 154, 141, 1)
  TOOLTIP_TEXT_COLOR_WHITE: "#5F4B8BFF", //rgba(95, 75, 139, 1)
  YELLOW: (opacity = 1) => `rgba(240, 182, 65, ${opacity})`,
  WHITE: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // #FFFFFF
  PURE_BLACK: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // #000000
  DARKER_BLUE: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // #0000FF
  // HOVER_WHITE: "#FAFAFA", //rgba(250, 250, 250, 1)
  PAGE_WRAPPER: "#FCFCFC", //rgba(252, 252, 252, 1)
  SEARCH_ICON_COLOR: "#c5c4cc", //rgba(197, 196, 204, 1)
  PDF_OVERLAY: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
  VERY_LIGHT_GREY: (opacity = 1) => `rgba(240, 240, 240, ${opacity})`, // "#F0F0F0"
  VERY_LIGHT_GREY2: (opacity = 1) => `rgba(227, 227, 227, ${opacity})`, // "#E3E3E3"
  VERY_LIGHT_GREY3: (opacity = 1) => `rgba(230, 230, 230, ${opacity})`, // "#E5E5E5"
  LIGHT_GREY_BLUE: "#D7D7E3", // rgba(215, 215, 227, 1)
  LIGHT_GREY_BLUE2: "#FBFBFD", // rgba(251, 251, 253, 1)
  LIGHT_GREY_BLUE3: "rgba(205, 219, 253, 1)",
  PAPER_TAB_BACKGROUND: (opacity = 1) => `rgba(243, 243, 248, ${opacity})`,
  VOTE_WIDGET_BACKGROUND: (opacity = 1) => `rgba(233, 250, 234, ${opacity})`,
  VOTE_ARRROW: "#AAA8B4", // rgba(170, 168, 180, 1)
  VERY_PALE_BLUE: "#E7EEFF", //rgba(231, 238, 255, 1)
  BANNER_PALE_BLUE: "#E9F2FF", // rgba(233, 242, 255, 1)
  BANNER_GREY_BLUE: "#F2F2F6", // rgba(242, 242, 246, 1)
  LIGHT_GREYISH_BLUE: "#e8e8f2", // rgba(232, 232, 242, 1)
  LIGHT_GRAYISH_BLUE2: (opacity = 1) => `rgba(236, 239, 241, ${opacity})`, // #eceff1
  LIGHT_GRAYISH_BLUE3: (opacity = 1) => `rgba(229, 229, 230, ${opacity})`, // #e5e5e6
  LIGHT_GRAYISH_BLUE4: (opacity = 1) => `rgba(234, 235, 254, ${opacity})`, // #eaebfe
  LIGHT_GREYISH_BLUE5: (opacity = 1) => `rgba(233, 234, 239, ${opacity})`, // #e9eaef
  GREYISH_BLUE: (opacity = 1) => `rgba(200, 200, 202, ${opacity})`, // #c8c8ca
  DARK_GREYISH_BLUE: (opacity = 1) => `rgba(129, 148, 167, ${opacity})`,
  DARK_GREYISH_BLUE2: (opacity = 1) => `rgba(145, 143, 155, ${opacity})`, // #918f9b
  DARK_GREYISH_BLUE3: (opacity = 1) => `rgba(101, 119, 134, ${opacity})`, // #657786
  DARK_GREYISH_BLUE4: (opacity = 1) => `rgba(122, 120, 135, ${opacity})`, // #7a7887
  VERY_DARK_GREYISH_BLUE: (opacity = 1) => `rgba(78, 76, 95, ${opacity})`, // #4e4c5f
  VERY_DARK_GRAYISH_BLUE2: (opacity = 1) => `rgba(50, 54, 57, ${opacity})`, // #323639
  DARK_DESATURATED_BLUE: (opacity = 1) => `rgba(35, 32, 56, ${opacity})`, // #232038
  VERY_DARK_DESATURATED_BLUE: (opacity = 1) => `rgba(26, 31, 58, ${opacity})`, // #1a1f3a
  LIGHT_BLUE2: (opacity = 1) => `rgba(70, 123, 255, ${opacity})`, // #467bff
  VIVID_RED: (opacity = 1) => `rgba(235, 51, 35, ${opacity})`, // #eb3323
  GREY_LIME_GREEN: (opacity = 1) => `rgba(242, 251, 243, ${opacity})`, // #f2fbf3
  MOSTLY_BLACK_GREY: (opacity = 1) => `rgba(21, 21, 21, ${opacity})`, // #151515
  PURE_YELLOW: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`, // #ffff00
  BRIGHT_ORANGE: (opacity = 1) => `rgba(252, 187, 41, ${opacity})`, // #fcbb29
  VERY_DARK_GREY: (opacity = 1) => `rgba(99, 99, 99, ${opacity})`, // #636363
  DARK_GREY: (opacity = 1) => `rgba(151, 151, 151, ${opacity})`, // #979797
  SOFT_BLUE: (opacity = 1) => `rgba(93, 83, 254, ${opacity})`, // #5d53fe
  VERY_DARK_BLUE: (opacity = 1) => `rgba(17, 51, 83, ${opacity})`, // #113353
  VERY_DARK_GRAYISH_YELLOW: (opacity = 1) => `rgba(55, 53, 47, ${opacity})`, // #37352f
  DARK_LIME_GREEN: (opacity = 1) => `rgba(19, 145, 26, ${opacity})`, // #13911a
  DARK_LIME_GREEN2: (opacity = 1) => `rgba(25, 160, 40, ${opacity})`, // #19a028
  DARK_RED: (opacity = 1) => `rgba(173, 34, 21, ${opacity})`, // #ad2215
  GRAY170: (opacity = 1) => `rgba(170, 170, 170, ${opacity})`, // #aaaaaa
  GRAY179: (opacity = 1) => `rgba(179, 179, 179, ${opacity})`, // #b3b3b3
  LIGHT_GRAY204: (opacity = 1) => `rgba(204, 204, 204, ${opacity})`, // #cccccc
  LIGHT_GRAY222: (opacity = 1) => `rgba(222, 222, 222, ${opacity})`, // #dedede
  GRAY190: (opacity = 1) => `rgba(190, 190, 190, ${opacity})`, // #bebebe
  DARY_GRAYISH_ORANGE: (opacity = 1) => `rgba(115, 108, 100, ${opacity})`, // #736c64
  LIME_GREEN: (opacity = 1) => `rgba(204, 243, 221, ${opacity})`, // #ccf3dd
  ACTIVE_LIME_GREEN: (opacity = 1) => `rgba(140, 230, 180, ${opacity})`, // #8ce6b4
  SOFT_LIME_GREEN: (opacity = 1) => `rgba(119, 220, 130, ${opacity})`, // #77dc82
  VIVID_ORANGE: (opacity = 1) => `rgba(237, 108, 2, ${opacity})`, // #ed6c02
  VERY_PALE_ORANGE: (opacity = 1) => `rgba(255, 244, 229, ${opacity})`, // #fff4e5
  VIVID_PINK: (opacity = 1) => `rgba(251, 17, 142, ${opacity})`, // #fb118e
  BRIGHT_BLUE: (opacity = 1) => `rgba(65, 114, 239, ${opacity})`, // #4172ef
  LIGHT_GRAYISH_PINK: (opacity = 1) => `rgba(248, 246, 247, ${opacity})`, // #f8f6f7
  VERY_PALE_PINK: (opacity = 1) => `rgba(255, 237, 245, ${opacity})`, // #ffedf5
};

let mode = "light";
if (typeof window !== "undefined") {
  mode = localStorage.getItem("theme");
}
if (mode === "dark") {
  colors = {
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
    LIGHT_GRAY_BACKGROUND2: (opacity = 1) => `rgba(5, 5, 3, ${opacity})`, // Darkened
    LIGHT_BLUE: (opacity = 1) => `rgba(18, 17, 1, ${opacity})`, // Darkened
    LIGHT_GREEN: (opacity = 1) => `rgba(19, 6, 20, ${opacity})`, // Adjusted
    LIGHT_GREY_BACKGROUND: "#121212", // Darkened
    LIGHT_GREY_BORDER: "rgba(216, 216, 216, 0.07)", // Unchanged
    LIGHT_GREY_TEXT: "rgba(219, 224, 195, 0.39)", // Adjusted
    LIGHT_GREY: (opacity = 1) => `rgba(20, 20, 20, ${opacity})`, // Darkened
    LIGHT_GREY2: (opacity = 1) => `rgba(21, 21, 21, ${opacity})`, // Darkened
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
    TOOLTIP_TEXT_COLOR_WHITE: "#A0B4B9FF", // Adjusted
    YELLOW: (opacity = 1) => `rgba(15, 73, 190, ${opacity})`, // Adjusted
    WHITE: (opacity = 1) => `rgba(40, 40, 40, ${opacity})`, // Adjusted
    PURE_BLACK: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Inverted
    DARKER_BLUE: (opacity = 1) => `rgba(50, 50, 255, ${opacity})`, // Adjusted
    // HOVER_WHITE: "#1A1A1A", // Adjusted
    PAGE_WRAPPER: "#030303", // Adjusted
    SEARCH_ICON_COLOR: "#3a393f", // Adjusted
    PDF_OVERLAY: (opacity = 0.4) => `rgba(102, 102, 102, ${opacity})`, // Adjusted
    VERY_LIGHT_GREY: (opacity = 1) => `rgba(40, 40, 40, ${opacity})`, // Adjusted
    VERY_LIGHT_GREY2: (opacity = 1) => `rgba(28, 28, 28, ${opacity})`, // Adjusted
    VERY_LIGHT_GREY3: (opacity = 1) => `rgba(80, 80, 80, ${opacity})`, // Adjusted
    LIGHT_GREY_BLUE: "#28283A", // Adjusted
    LIGHT_GREY_BLUE2: "#040405", // Adjusted
    LIGHT_GREY_BLUE3: "rgba(50, 60, 90, 1)", // Adjusted
    PAPER_TAB_BACKGROUND: (opacity = 1) => `rgba(12, 12, 15, ${opacity})`, // Adjusted
    VOTE_WIDGET_BACKGROUND: (opacity = 1) => `rgba(30, 45, 35, ${opacity})`, // Adjusted
    VOTE_ARRROW: "#D5D3DF", // Adjusted
    VERY_PALE_BLUE: "#172A3A", // Adjusted
    BANNER_PALE_BLUE: "#1A2138", // Adjusted
    BANNER_GREY_BLUE: "#2A2A35", // Adjusted
    LIGHT_GREYISH_BLUE: "#1a1a28", // Adjusted
    LIGHT_GRAYISH_BLUE2: (opacity = 1) => `rgba(40, 43, 45, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE3: (opacity = 1) => `rgba(26, 26, 25, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE4: (opacity = 1) => `rgba(60, 61, 80, ${opacity})`, // Adjusted
    GREYISH_BLUE: (opacity = 1) => `rgba(80, 80, 82, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE: (opacity = 1) => `rgba(79, 88, 97, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE2: (opacity = 1) => `rgba(175, 173, 185, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE3: (opacity = 1) => `rgba(141, 159, 174, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE4: (opacity = 1) => `rgba(72, 70, 85, ${opacity})`, // Adjusted
    VERY_DARK_GREYISH_BLUE: (opacity = 1) => `rgba(98, 96, 115, ${opacity})`, // Adjusted
    VERY_DARK_GRAYISH_BLUE2: (opacity = 1) => `rgba(110, 114, 117, ${opacity})`, // Adjusted
    DARK_DESATURATED_BLUE: (opacity = 1) => `rgba(75, 72, 96, ${opacity})`, // Adjusted
    VERY_DARK_DESATURATED_BLUE: (opacity = 1) =>
      `rgba(76, 81, 108, ${opacity})`, // Adjusted
    LIGHT_BLUE2: (opacity = 1) => `rgba(50, 103, 235, ${opacity})`, // Adjusted
    VIVID_RED: (opacity = 1) => `rgba(215, 31, 15, ${opacity})`, // Adjusted
    GREY_LIME_GREEN: (opacity = 1) => `rgba(62, 71, 63, ${opacity})`, // Adjusted
    MOSTLY_BLACK_GREY: (opacity = 1) => `rgba(62, 71, 63, ${opacity})`, // Adjusted
    PURE_YELLOW: (opacity = 1) => `rgba(235, 235, 80, ${opacity})`, // Adjusted
    BRIGHT_ORANGE: (opacity = 1) => `rgba(235, 170, 24, ${opacity})`, // Adjusted
    VERY_DARK_GREY: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`, // Adjusted
    DARK_GREY: (opacity = 1) => `rgba(180, 180, 180, ${opacity})`, // Adjusted
    SOFT_BLUE: (opacity = 1) => `rgba(83, 73, 234, ${opacity})`, // Adjusted
    VERY_DARK_BLUE: (opacity = 1) => `rgba(37, 71, 103, ${opacity})`, // Adjusted
    VERY_DARK_GRAYISH_YELLOW: (opacity = 1) =>
      `rgba(200, 198, 192, ${opacity})`, // Adjusted
    DARK_LIME_GREEN: (opacity = 1) => `rgba(50, 175, 57, ${opacity})`, // Adjusted
    DARK_LIME_GREEN2: (opacity = 1) => `rgba(15, 100, 25, ${opacity})`, // Adjusted
    DARK_RED: (opacity = 1) => `rgba(193, 54, 41, ${opacity})`, // Adjusted
    GRAY170: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`, // Adjusted
    GRAY179: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`, // Adjusted
    LIGHT_GRAY204: (opacity = 1) => `rgba(85, 85, 85, ${opacity})`, // Adjusted
    LIGHT_GRAY222: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`, // Adjusted
    GRAY190: (opacity = 1) => `rgba(65, 65, 65, ${opacity})`, // Adjusted
    DARY_GRAYISH_ORANGE: (opacity = 1) => `rgba(140, 133, 125, ${opacity})`, // Adjusted
    LIME_GREEN: (opacity = 1) => `rgba(102, 183, 161, ${opacity})`, // Adjusted
    ACTIVE_LIME_GREEN: (opacity = 1) => `rgba(70, 180, 130, ${opacity})`, // Adjusted
    SOFT_LIME_GREEN: (opacity = 1) => `rgba(60, 170, 80, ${opacity})`, // Adjusted
    VIVID_ORANGE: (opacity = 1) => `rgba(190, 85, 0, ${opacity})`, // Adjusted
    VERY_PALE_ORANGE: (opacity = 1) => `rgba(128, 100, 70, ${opacity})`, // Adjusted
    VIVID_PINK: (opacity = 1) => `rgba(191, 12, 108, ${opacity})`, // Adjusted
    BRIGHT_BLUE: (opacity = 1) => `rgba(40, 90, 215, ${opacity})`, // #Adjusted
    LIGHT_GRAYISH_PINK: (opacity = 1) => `rgba(80, 78, 79, ${opacity})`, // #Adjusted
    VERY_PALE_PINK: (opacity = 1) => `rgba(105, 67, 85, ${opacity})`, // #Adjusted
  };
}

export const bountyColors = {
  BADGE_TEXT: colors.ORANGE_DARK2(1),
  BADGE_BACKGROUND: colors.ORANGE_LIGHTER(),
};

export const genericCardColors = {
  BORDER: colors.LIGHT_GREY_BACKGROUND,
  BACKGROUND: colors.HOVER_WHITE,
};

export const formColors = {
  MESSAGE: colors.BLACK(0.65),
  BACKGROUND: colors.VERY_LIGHT_GREY(),
  BORDER: colors.LIGHT_GREY_BLUE,
  INPUT: colors.LIGHT_GREY_BLUE2,
};

export const paperTabColors = {
  FONT: colors.BLACK(0.5),
  HOVER_FONT: colors.BLACK(1),
  SELECTED: colors.BLUE(1),
  BACKGROUND: colors.PAPER_TAB_BACKGROUND(1),
};

export const voteWidgetColors = {
  BACKGROUND: colors.VOTE_WIDGET_BACKGROUND(1),
  ARROW: colors.VOTE_ARRROW,
};

export const discussionPageColors = {
  DIVIDER: colors.GREY_BORDER,
  ICON: colors.VERY_PALE_BLUE,
  ICON_HOVER: colors.LIGHT_GREY_BLUE3,
};

export const modalColors = {
  SUBTITLE: colors.BLACK(0.65),
};

export const bannerColor = {
  BLUE: colors.BANNER_PALE_BLUE,
  GREY: colors.BANNER_GREY_BLUE,
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
