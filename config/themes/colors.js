let colors = {
  BLACK: (opacity = 1) => `rgba(36, 31, 58, ${opacity})`, // #241F3A
  BLACK_TEXT: (opacity = 1) => `rgba(64, 64, 64, ${opacity})`, // #404040
  BLUE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`, // #4E53FF
  DARK_GREEN: (opacity = 1) => `rgba(61, 143, 88, ${opacity})`, // #3D8F58
  DARK_YELLOW: (opacity = 1) => `rgb(239, 160, 0, ${opacity})`, // #EFA000
  DARK_YELLOW: (opacity = 1) => `rgba(235, 175, 61, ${opacity})`, // #EBAF3D
  DARKER_GREY: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`, // #666666
  DARKER_GREY117: (opacity = 1) => `rgba(117, 117, 117, ${opacity})`, // #757575
  EDITOR_TAG_BACKGROUND: "rgba(232, 181, 4, 0.1)",
  EDITOR_TAG_TEXT: "#E8B504", //rgba(232, 181, 4, 1)
  ERROR_BACKGROUND: (opacity = 1) => `rgba(255, 83, 83, ${opacity})`, // #FF5353
  GREEN: (opacity = 1) => `rgba(100, 196, 143, ${opacity})`, // #64C48F
  GREEN: (opacity = 1) => `rgba(30, 207, 49, ${opacity})`, // #1ECF31
  GREY_BORDER: "#EBEBEB", //rgba(232, 232, 239, 1)
  GREY_ICY_BLUE_HUE: "rgba(249, 249, 252, 1)", // #F9F9FC
  GREY_LINE: (opacity = 1) => `rgba(232, 232, 239, ${opacity})`, // #E8E8EF
  GREY: (opacity = 1) => `rgba(193, 193, 207, ${opacity})`, // #C1C1CF
  ICY_BLUE: "#E9EFFF", // rgba(233, 239, 255, 1)
  ICY_GREY: "rgb(251, 251, 253)", // #FBFBFD
  INPUT_BACKGROUND_GREY: "rgba(250, 250, 250, 1)", // #FAFAFA
  LIGHT_GRAY_BACKGROUND: (opacity = 1) => `rgba(250, 250, 250, ${opacity})`, // #FAFAFA
  LIGHT_GRAY_BACKGROUND2: (opacity = 1) => `rgba(250, 250, 252, ${opacity})`, // #fafafc
  LIGHT_GRAY_BACKGROUND3: (opacity = 1) => `rgba(250, 250, 253, ${opacity})`, // #fafafd
  LIGHT_GRAY_BACKGROUND4: (opacity = 1) => `rgba(251, 251, 251, ${opacity})`, // #fbfbfb
  LIGHT_BLUE: (opacity = 1) => `rgba(237, 238, 254, ${opacity})`, // #EDEFFE
  LIGHT_BLUE2: (opacity = 1) => `rgba(70, 123, 255, ${opacity})`, // #467bff
  LIGHT_BLUE3: (opacity = 1) => `rgba(88, 144, 255, ${opacity})`, // #5890ff
  LIGHT_GREEN: (opacity = 1) => `rgba(236, 249, 235, ${opacity})`, // #ECF9EB
  LIGHT_GREY_BACKGROUND: "#EDEDED", // rgba(237, 237, 237, 1)
  LIGHT_GREY_BACKGROUND2: (opacity = 1) => `rgba(237, 237, 240, ${opacity})`, // #ededf0
  LIGHT_GREY_BORDER: "rgba(39, 39, 39, 0.07)",
  LIGHT_GREY_SUBHEADER: (opacity = 1) => `rgba(39, 39, 39, ${opacity})`, // #272727
  LIGHT_GREY_TEXT: "rgba(36, 31, 58, 0.39)",
  LIGHT_GREY: (opacity = 1) => `rgba(235, 235, 235, ${opacity})`, // #EBEBEB
  LIGHT_GREY2: (opacity = 1) => `rgba(234, 234, 234, ${opacity})`, // #EAEAEA
  LIGHT_YELLOW: (opacity = 1) => `rgba(253, 249, 237, ${opacity})`, // #FDF9ED
  LIGHTER_BLUE: (opacity = 1) => `rgb(235,241,255, ${opacity})`, // #EBF1FF
  LIGHTER_GREY_BACKGROUND: "#F6F6F8", // rgba(246, 246, 248, 1)
  LIGHTER_GREY: (opacity = 1) => `rgba(243, 243, 243, ${opacity})`, // #F3F3F3
  MEDIUM_GREY: (opacity = 1) => `rgba(144, 144, 144, ${opacity})`, // #909090
  MEDIUM_GREY2: (opacity = 1) => `rgb(124,121,137, ${opacity})`, // #7C7989
  NAVY: (opacity = 1) => `rgba(31, 40, 125, ${opacity})`, // #1F287D
  NEW_BLUE: (opacity = 1) => `rgba(57, 113, 255, ${opacity})`, // #3971ff
  NEW_GREEN: (opacity = 1) => `rgba(72, 192, 85, ${opacity})`, // #48c055
  ORANGE_DARK: (opacity = 1) => `rgba(237, 157, 20, ${opacity})`, // #ED9D14
  ORANGE_DARK2: (opacity = 1) => `rgba(255, 122, 0, ${opacity})`, // #FF7A00
  ORANGE_LIGHT: (opacity = 1) => `rgb(255, 195, 61, ${opacity})`, // #FFC33D
  ORANGE_LIGHT2: (opacity = 1) => `rgb(255, 148, 22, ${opacity})`, // #FF9416
  ORANGE: (opacity = 1) => `rgba(255, 176, 0, ${opacity})`, // #FFB000
  PURE_ORANGE: (opacity = 1) => `rgba(231, 118, 0, ${opacity})`, // #E77600
  PURE_ORANGE2: (opacity = 1) => `rgba(255, 109, 0, ${opacity})`, // #FF6D00
  ORANGE_LIGHTER: (opacity = 1) => `rgb(252, 242, 220, ${opacity})`, // #FCF2DC
  LIGHT_GRAYISH_ORANGE: (opacity = 1) => `rgba(253, 242, 222, ${opacity})`, // #FDF2DE
  PASTEL_GREEN_TEXT: "#88cb88", //rgba(136, 203, 136, 1)
  PLACEHOLDER_CARD_BACKGROUND: "#efefef", //rgba(239, 239, 239, 1)
  PURPLE_LIGHT: (opacity = 1) => `rgb(112, 60, 255, ${opacity})`, // #703CFF
  PURPLE: (opacity = 1) => `rgba(78, 83, 255, ${opacity})`, // #4E53FF
  RED: (opacity = 1) => `rgba(255, 45, 45, ${opacity})`, // #FF2D2D
  STANDARD_BOX_SHADOW: "rgba(185, 185, 185, 0.25)", // #B9B9B9
  TEXT_DARKER_GREY: "#241F3A", //rgba(36, 31, 58, 1)
  TEXT_GREY: (opacity = 1) => `rgba(128, 126, 134, ${opacity})`, // #807E86
  TOOLTIP_BACKGROUND_BLACK: "#E69A8DFF", //rgba(230, 154, 141, 1)
  TOOLTIP_TEXT_COLOR_WHITE: "#5F4B8BFF", //rgba(95, 75, 139, 1)
  YELLOW: (opacity = 1) => `rgba(240, 182, 65, ${opacity})`, // #F0B641
  SOFT_YELLOW: (opacity = 1) => `rgba(246, 230, 83, ${opacity})`, // #F6E653
  SOFT_YELLOW_BORDER: (opacity = 1) => `rgba(248, 222, 90, ${opacity})`, // #F8DE5A
  WHITE: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // #FFFFFF
  PURE_BLACK: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // #000000
  DARKER_BLUE: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // #0000FF
  PAGE_WRAPPER: "#FCFCFC", //rgba(252, 252, 252, 1)
  SEARCH_ICON_COLOR: "#c5c4cc", //rgba(197, 196, 204, 1)
  PDF_OVERLAY: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
  VERY_LIGHT_GREY: (opacity = 1) => `rgba(240, 240, 240, ${opacity})`, // "#F0F0F0"
  VERY_LIGHT_GREY2: (opacity = 1) => `rgba(227, 227, 227, ${opacity})`, // "#E3E3E3"
  VERY_LIGHT_GREY3: (opacity = 1) => `rgba(230, 230, 230, ${opacity})`, // "#E5E5E5"
  LIGHT_GREY_BLUE: "#D7D7E3", // rgba(215, 215, 227, 1)
  LIGHT_GREY_BLUE3: "rgba(205, 219, 253, 1)", // #CDDBFD
  PAPER_TAB_BACKGROUND: (opacity = 1) => `rgba(243, 243, 248, ${opacity})`, // #F3F3F8
  VOTE_WIDGET_BACKGROUND: (opacity = 1) => `rgba(233, 250, 234, ${opacity})`, // #E9FAEA
  VOTE_ARRROW: "#AAA8B4", // rgba(170, 168, 180, 1)
  VERY_PALE_BLUE: "#E7EEFF", //rgba(231, 238, 255, 1)
  VERY_PALE_BLUE2: (opacity = 1) => `rgba(229, 237, 255, ${opacity})`, // #e5edff
  VERY_PALE_BLUE3: (opacity = 1) => `rgba(241, 245, 255, ${opacity})`, // #f1f5ff
  BANNER_PALE_BLUE: "#E9F2FF", // rgba(233, 242, 255, 1)
  BANNER_GREY_BLUE: "#F2F2F6", // rgba(242, 242, 246, 1)
  LIGHT_GREYISH_BLUE: "#e8e8f2", // rgba(232, 232, 242, 1)
  LIGHT_GRAYISH_BLUE2: (opacity = 1) => `rgba(236, 239, 241, ${opacity})`, // #eceff1
  LIGHT_GRAYISH_BLUE3: (opacity = 1) => `rgba(229, 229, 230, ${opacity})`, // #e5e5e6
  LIGHT_GRAYISH_BLUE4: (opacity = 1) => `rgba(234, 235, 254, ${opacity})`, // #eaebfe
  LIGHT_GREYISH_BLUE5: (opacity = 1) => `rgba(233, 234, 239, ${opacity})`, // #e9eaef
  LIGHT_GRAYISH_BLUE6: (opacity = 1) => `rgba(210, 210, 230, ${opacity})`, // #d2d2e6
  LIGHT_GRAYISH_BLUE7: (opacity = 1) => `rgba(247, 247, 251, ${opacity})`, // #f7f7fb
  LIGHT_GRAYISH_BLUE8: (opacity = 1) => `rgba(245, 245, 249, ${opacity})`, // #f5f5f9
  LIGHT_GRAYISH_BLUE9: (opacity = 1) => `rgba(216, 216, 222, ${opacity})`, // #d8d8de
  LIGHT_GRAYISH_BLUE10: (opacity = 1) => `rgba(237, 238, 254, ${opacity})`, // #edeefe
  LIGHT_GRAYISH_BLUE11: (opacity = 1) => `rgba(236, 239, 252, ${opacity})`, // #eceffc
  LIGHT_GRAYISH_BLUE12: (opacity = 1) => `rgba(237, 242, 250, ${opacity})`, // #edf2fa
  LIGHT_GRAYISH_BLUE13: (opacity = 1) => `rgba(240, 241, 247, ${opacity})`, // #f0f1f7
  LIGHT_GRAYISH_BLUE14: (opacity = 1) => `rgba(227, 227, 231, ${opacity})`, // #e3e3e7
  GREYISH_BLUE: (opacity = 1) => `rgba(200, 200, 202, ${opacity})`, // #c8c8ca
  GREYISH_BLUE2: (opacity = 1) => `rgba(170, 167, 185, ${opacity})`, // #aaa7b9
  GREYISH_BLUE3: (opacity = 1) => `rgba(189, 195, 199, ${opacity})`, // #bdc3c7
  GREYISH_BLUE4: (opacity = 1) => `rgba(175, 173, 183, ${opacity})`, // #afadb7
  GREYISH_BLUE5: (opacity = 1) => `rgba(193, 194, 206, ${opacity})`, // #c1c2ce
  DARK_GREYISH_BLUE: (opacity = 1) => `rgba(129, 148, 167, ${opacity})`, // #8194a7
  DARK_GREYISH_BLUE2: (opacity = 1) => `rgba(145, 143, 155, ${opacity})`, // #918f9b
  DARK_GREYISH_BLUE3: (opacity = 1) => `rgba(101, 119, 134, ${opacity})`, // #657786
  DARK_GREYISH_BLUE4: (opacity = 1) => `rgba(122, 120, 135, ${opacity})`, // #7a7887
  DARK_GREYISH_BLUE5: (opacity = 1) => `rgba(167, 166, 176, ${opacity})`, // #a7a6b0
  DARK_GREYISH_BLUE6: (opacity = 1) => `rgba(120, 124, 126, ${opacity})`, // #787c7e
  DARK_GREYISH_BLUE7: (opacity = 1) => `rgba(142, 141, 154, ${opacity})`, // #8e8d9a
  DARK_GREYISH_BLUE8: (opacity = 1) => `rgba(155, 153, 162, ${opacity})`, // #9b99a2
  DARK_GREYISH_BLUE9: (opacity = 1) => `rgba(112, 110, 127, ${opacity})`, // #706e7f
  DARK_GREYISH_BLUE10: (opacity = 1) => `rgba(147, 145, 158, ${opacity})`, // #93919e
  DARK_GREYISH_BLUE11: (opacity = 1) => `rgba(165, 164, 174, ${opacity})`, // #a5a4ae
  DARK_GREYISH_BLUE12: (opacity = 1) => `rgba(132, 130, 144, ${opacity})`, // #848290
  DARK_GREYISH_BLUE13: (opacity = 1) => `rgba(111, 108, 125, ${opacity})`, // #6f6c7d
  DARK_GREYISH_BLUE14: (opacity = 1) => `rgba(141, 139, 154, ${opacity})`, // #8d8b9a
  DARK_GREYISH_BLUE15: (opacity = 1) => `rgba(140, 139, 154, ${opacity})`, // #8c8b9a
  VERY_DARK_GREYISH_BLUE: (opacity = 1) => `rgba(78, 76, 95, ${opacity})`, // #4e4c5f
  VERY_DARK_GRAYISH_BLUE2: (opacity = 1) => `rgba(50, 54, 57, ${opacity})`, // #323639
  VERY_DARK_GRAYISH_BLUE3: (opacity = 1) => `rgba(79, 77, 95, ${opacity})`, // #4f4d5f
  VERY_DARK_GRAYISH_BLUE4: (opacity = 1) => `rgba(55, 58, 71, ${opacity})`, // #373a47
  VERY_DARK_GRAYISH_BLUE5: (opacity = 1) => `rgba(90, 86, 106, ${opacity})`, // #5a566a
  DARK_DESATURATED_BLUE: (opacity = 1) => `rgba(35, 32, 56, ${opacity})`, // #232038
  VERY_DARK_DESATURATED_BLUE: (opacity = 1) => `rgba(26, 31, 58, ${opacity})`, // #1a1f3a
  DARK_MOSTLY_DESATURATED_BLUE: (opacity = 1) =>
    `rgba(72, 75, 118, ${opacity})`, // #484b76
  VIVID_RED: (opacity = 1) => `rgba(235, 51, 35, ${opacity})`, // #eb3323
  GREY_LIME_GREEN: (opacity = 1) => `rgba(242, 251, 243, ${opacity})`, // #f2fbf3
  LIGHT_GRAYISH_LIME_GREEN: (opacity = 1) => `rgba(213, 243, 215, ${opacity})`, // #d5f3d7
  MOSTLY_BLACK_GREY: (opacity = 1) => `rgba(21, 21, 21, ${opacity})`, // #151515
  MOSTLY_BLACK_GREY2: (opacity = 1) => `rgba(17, 17, 17, ${opacity})`, // #111111
  PURE_YELLOW: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`, // #ffff00
  BRIGHT_ORANGE: (opacity = 1) => `rgba(252, 187, 41, ${opacity})`, // #fcbb29
  VERY_DARK_GREY: (opacity = 1) => `rgba(99, 99, 99, ${opacity})`, // #636363
  VERY_DARK_GREY2: (opacity = 1) => `rgba(96, 96, 96, ${opacity})`, // #606060
  DARK_GREY: (opacity = 1) => `rgba(151, 151, 151, ${opacity})`, // #979797
  SOFT_BLUE: (opacity = 1) => `rgba(93, 83, 254, ${opacity})`, // #5d53fe
  SOFT_BLUE2: (opacity = 1) => `rgba(123, 211, 249, ${opacity})`, // #7bd3f9
  VERY_DARK_BLUE: (opacity = 1) => `rgba(17, 51, 83, ${opacity})`, // #113353
  GRAYISH_YELLOW: (opacity = 1) => `rgba(184, 183, 173, ${opacity})`, // #b8b7ad
  VERY_DARK_GRAYISH_YELLOW: (opacity = 1) => `rgba(55, 53, 47, ${opacity})`, // #37352f
  DARK_GRAYISH_YELLOW: (opacity = 1) => `rgba(130, 129, 125, ${opacity})`, // #82817d
  LIGHT_GRAYISH_YELLOW: (opacity = 1) => `rgba(253, 248, 230, ${opacity})`, // #fdf8e6
  LIGHT_GRAYISH_YELLOW2: (opacity = 1) => `rgba(249, 244, 211, ${opacity})`, // #f9f4d3
  DARK_LIME_GREEN: (opacity = 1) => `rgba(19, 145, 26, ${opacity})`, // #13911a
  DARK_LIME_GREEN2: (opacity = 1) => `rgba(25, 160, 40, ${opacity})`, // #19a028
  DARK_LIME_GREEN3: (opacity = 1) => `rgba(5, 109, 78, ${opacity})`, // #056d4e
  VERY_DARK_LIME_GREEN: (opacity = 1) => `rgba(42, 98, 24, ${opacity})`, // #2a6218
  DARK_CYAN: (opacity = 1) => `rgba(0, 163, 124, ${opacity})`, // #00a37c Gitcoin color
  DARK_RED: (opacity = 1) => `rgba(173, 34, 21, ${opacity})`, // #ad2215
  DARK_RED2: (opacity = 1) => `rgba(169, 0, 0, ${opacity})`, // #a90000
  GRAY165: (opacity = 1) => `rgba(165, 165, 165, ${opacity})`, // #a5a5a5
  GRAY170: (opacity = 1) => `rgba(170, 170, 170, ${opacity})`, // #aaaaaa
  GRAY179: (opacity = 1) => `rgba(179, 179, 179, ${opacity})`, // #b3b3b3
  GRAY190: (opacity = 1) => `rgba(190, 190, 190, ${opacity})`, // #bebebe
  LIGHT_GRAY199: (opacity = 1) => `rgba(199, 199, 199, ${opacity})`, // #c7c7c7
  LIGHT_GRAY204: (opacity = 1) => `rgba(204, 204, 204, ${opacity})`, // #cccccc
  LIGHT_GRAY208: (opacity = 1) => `rgba(208, 208, 208, ${opacity})`, // #d0d0d0
  LIGHT_GRAY211: (opacity = 1) => `rgba(211, 211, 211, ${opacity})`, // #d3d3d3
  LIGHT_GRAY221: (opacity = 1) => `rgba(221, 221, 221, ${opacity})`, // #dddddd
  LIGHT_GRAY222: (opacity = 1) => `rgba(222, 222, 222, ${opacity})`, // #dedede
  LIGHT_GRAY223: (opacity = 1) => `rgba(223, 223, 223, ${opacity})`, // #dfdfdf
  LIGHT_GRAY238: (opacity = 1) => `rgba(238, 238, 238, ${opacity})`, // #eeeeee
  LIGHT_GRAY242: (opacity = 1) => `rgba(242, 242, 242, ${opacity})`, // #f2f2f2
  DARK_GRAY153: (opacity = 1) => `rgba(153, 153, 153, ${opacity})`, // #999999
  DARY_GRAYISH_ORANGE: (opacity = 1) => `rgba(115, 108, 100, ${opacity})`, // #736c64
  DARK_GRAYISH_ORANGE2: (opacity = 1) => `rgba(131, 129, 124, ${opacity})`, // #83817c
  LIME_GREEN: (opacity = 1) => `rgba(204, 243, 221, ${opacity})`, // #ccf3dd
  ACTIVE_LIME_GREEN: (opacity = 1) => `rgba(140, 230, 180, ${opacity})`, // #8ce6b4
  SOFT_LIME_GREEN: (opacity = 1) => `rgba(119, 220, 130, ${opacity})`, // #77dc82
  SOFT_LIME_GREEN2: (opacity = 1) => `rgba(122, 233, 177, ${opacity})`, // #7ae9b1
  VIVID_ORANGE: (opacity = 1) => `rgba(237, 108, 2, ${opacity})`, // #ed6c02
  VERY_PALE_ORANGE: (opacity = 1) => `rgba(255, 244, 229, ${opacity})`, // #fff4e5
  SOFT_ORANGE: (opacity = 1) => `rgba(220, 170, 114, ${opacity})`, // #dcaa72
  MOSTLY_BLACK_ORANGE: (opacity = 1) => `rgba(42, 40, 37, ${opacity})`, // #2a2825
  VIVID_PINK: (opacity = 1) => `rgba(251, 17, 142, ${opacity})`, // #fb118e
  VIVID_PINK2_UNISWAP_ICON: (opacity = 1) => `rgba(254, 15, 122, ${opacity})`, // #fe0f7a
  BRIGHT_BLUE: (opacity = 1) => `rgba(65, 114, 239, ${opacity})`, // #4172ef
  BRIGHT_BLUE2: (opacity = 1) => `rgba(62, 67, 232, ${opacity})`, // #3e43e8
  BRIGHT_BLUE3: (opacity = 1) => `rgba(63, 133, 247, ${opacity})`, // #3f85f7
  PURE_BLUE: (opacity = 1) => `rgba(0, 172, 238, ${opacity})`, // #00acee
  STRONG_BLUE: (opacity = 1) => `rgba(6, 95, 212, ${opacity})`, // #065fd4
  LIGHT_GRAYISH_PINK: (opacity = 1) => `rgba(248, 246, 247, ${opacity})`, // #f8f6f7
  LIGHT_GRAYISH_VIOLET: (opacity = 1) => `rgba(238, 236, 239, ${opacity})`, // #eeecef
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
    DARKER_GREY117: (opacity = 1) => `rgba(180, 180, 180, ${opacity})`, // Lightened
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
    LIGHT_GRAY_BACKGROUND3: (opacity = 1) => `rgba(30, 30, 33, ${opacity})`, // Darkened
    LIGHT_GRAY_BACKGROUND4: (opacity = 1) => `rgba(28, 28, 28, ${opacity})`, // Darkened
    LIGHT_BLUE: (opacity = 1) => `rgba(18, 17, 1, ${opacity})`, // Darkened
    LIGHT_BLUE2: (opacity = 1) => `rgba(50, 103, 235, ${opacity})`, // Adjusted
    LIGHT_BLUE3: (opacity = 1) => `rgba(58, 114, 235, ${opacity})`, // Adjusted
    LIGHT_GREEN: (opacity = 1) => `rgba(19, 6, 20, ${opacity})`, // Adjusted
    LIGHT_GREY_BACKGROUND: "#121212", // Darkened
    LIGHT_GREY_BACKGROUND2: (opacity = 1) => `rgba(43, 43, 46, ${opacity})`, // Darkened
    LIGHT_GREY_BORDER: "rgba(216, 216, 216, 0.07)", // Adjusted
    LIGHT_GREY_SUBHEADER: (opacity = 1) => `rgba(216, 216, 216, ${opacity})`, // Adjusted
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
    PURE_ORANGE: (opacity = 1) => `rgba(180, 92, 0, ${opacity})`, // Adjusted
    PURE_ORANGE2: (opacity = 1) => `rgba(200, 85, 0, ${opacity})`, // Adjusted
    ORANGE_LIGHTER: (opacity = 1) => `rgb(3, 13, 35, ${opacity})`, // Darkened
    LIGHT_GRAYISH_ORANGE: (opacity = 1) => `rgba(63, 52, 42, ${opacity})`, // Darkened
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
    SOFT_YELLOW: (opacity = 1) => `rgba(180, 165, 40, ${opacity})`, // Adjusted
    SOFT_YELLOW_BORDER: (opacity = 1) => `rgba(128, 112, 45, ${opacity})`, // Adjusted
    WHITE: (opacity = 1) => `rgba(40, 40, 40, ${opacity})`, // Adjusted
    PURE_BLACK: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Inverted
    DARKER_BLUE: (opacity = 1) => `rgba(50, 50, 255, ${opacity})`, // Adjusted
    PAGE_WRAPPER: "#030303", // Adjusted
    SEARCH_ICON_COLOR: "#3a393f", // Adjusted
    PDF_OVERLAY: (opacity = 0.4) => `rgba(102, 102, 102, ${opacity})`, // Adjusted
    VERY_LIGHT_GREY: (opacity = 1) => `rgba(40, 40, 40, ${opacity})`, // Adjusted
    VERY_LIGHT_GREY2: (opacity = 1) => `rgba(28, 28, 28, ${opacity})`, // Adjusted
    VERY_LIGHT_GREY3: (opacity = 1) => `rgba(80, 80, 80, ${opacity})`, // Adjusted
    LIGHT_GREY_BLUE: "#28283A", // Adjusted
    LIGHT_GREY_BLUE3: "rgba(50, 60, 90, 1)", // Adjusted
    PAPER_TAB_BACKGROUND: (opacity = 1) => `rgba(12, 12, 15, ${opacity})`, // Adjusted
    VOTE_WIDGET_BACKGROUND: (opacity = 1) => `rgba(30, 45, 35, ${opacity})`, // Adjusted
    VOTE_ARRROW: "#D5D3DF", // Adjusted
    VERY_PALE_BLUE: "#172A3A", // Adjusted
    VERY_PALE_BLUE2: (opacity = 1) => `rgba(51, 59, 77, ${opacity})`, // Adjusted
    VERY_PALE_BLUE3: (opacity = 1) => `rgba(45, 49, 63, ${opacity})`, // Adjusted
    BANNER_PALE_BLUE: "#1A2138", // Adjusted
    BANNER_GREY_BLUE: "#2A2A35", // Adjusted
    LIGHT_GREYISH_BLUE: "#1a1a28", // Adjusted
    LIGHT_GRAYISH_BLUE2: (opacity = 1) => `rgba(40, 43, 45, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE3: (opacity = 1) => `rgba(26, 26, 25, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE4: (opacity = 1) => `rgba(60, 61, 80, ${opacity})`, // Adjusted
    LIGHT_GREYISH_BLUE5: (opacity = 1) => `rgba(40, 41, 46, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE6: (opacity = 1) => `rgba(60, 60, 80, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE7: (opacity = 1) => `rgba(40, 40, 45, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE8: (opacity = 1) => `rgba(40, 40, 45, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE9: (opacity = 1) => `rgba(64, 64, 70, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE10: (opacity = 1) => `rgba(60, 61, 77, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE11: (opacity = 1) => `rgba(60, 63, 76, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE12: (opacity = 1) => `rgba(40, 45, 60, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE13: (opacity = 1) => `rgba(40, 41, 47, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_BLUE14: (opacity = 1) => `rgba(83, 83, 87, ${opacity})`, // Adjusted
    GREYISH_BLUE: (opacity = 1) => `rgba(80, 80, 82, ${opacity})`, // Adjusted
    GREYISH_BLUE2: (opacity = 1) => `rgba(190, 187, 205, ${opacity})`, // Adjusted
    GREYISH_BLUE3: (opacity = 1) => `rgba(95, 101, 105, ${opacity})`, // Adjusted
    GREYISH_BLUE4: (opacity = 1) => `rgba(90, 88, 98, ${opacity})`, // Adjusted
    GREYISH_BLUE5: (opacity = 1) => `rgba(143, 144, 156, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE: (opacity = 1) => `rgba(79, 88, 97, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE2: (opacity = 1) => `rgba(175, 173, 185, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE3: (opacity = 1) => `rgba(141, 159, 174, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE4: (opacity = 1) => `rgba(72, 70, 85, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE5: (opacity = 1) => `rgba(90, 90, 100, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE6: (opacity = 1) => `rgba(180, 184, 186, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE7: (opacity = 1) => `rgba(172, 171, 184, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE8: (opacity = 1) => `rgba(105, 103, 112, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE9: (opacity = 1) => `rgba(160, 158, 175, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE10: (opacity = 1) => `rgba(193, 191, 204, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE11: (opacity = 1) => `rgba(205, 204, 214, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE12: (opacity = 1) => `rgba(172, 170, 184, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE13: (opacity = 1) => `rgba(155, 152, 169, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE14: (opacity = 1) => `rgba(171, 169, 184, ${opacity})`, // Adjusted
    DARK_GREYISH_BLUE15: (opacity = 1) => `rgba(170, 169, 184, ${opacity})`, // Adjusted
    VERY_DARK_GREYISH_BLUE: (opacity = 1) => `rgba(98, 96, 115, ${opacity})`, // Adjusted
    VERY_DARK_GRAYISH_BLUE2: (opacity = 1) => `rgba(110, 114, 117, ${opacity})`, // Adjusted
    VERY_DARK_GRAYISH_BLUE3: (opacity = 1) => `rgba(110, 108, 126, ${opacity})`, // Adjusted
    VERY_DARK_GRAYISH_BLUE4: (opacity = 1) => `rgba(95, 98, 111, ${opacity})`, // Adjusted
    VERY_DARK_GRAYISH_BLUE5: (opacity = 1) => `rgba(130, 126, 146, ${opacity})`, // Adjusted
    DARK_DESATURATED_BLUE: (opacity = 1) => `rgba(75, 72, 96, ${opacity})`, // Adjusted
    VERY_DARK_DESATURATED_BLUE: (opacity = 1) =>
      `rgba(76, 81, 108, ${opacity})`, // Adjusted
    DARK_MOSTLY_DESATURATED_BLUE: (opacity = 1) =>
      `rgba(112, 115, 158, ${opacity})`, // Adjusted
    VIVID_RED: (opacity = 1) => `rgba(215, 31, 15, ${opacity})`, // Adjusted
    GREY_LIME_GREEN: (opacity = 1) => `rgba(62, 71, 63, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_LIME_GREEN: (opacity = 1) => `rgba(85, 115, 87, ${opacity})`, // Adjusted
    MOSTLY_BLACK_GREY: (opacity = 1) => `rgba(62, 71, 63, ${opacity})`, // Adjusted
    MOSTLY_BLACK_GREY2: (opacity = 1) => `rgba(238, 238, 238, ${opacity})`, // Adjusted
    PURE_YELLOW: (opacity = 1) => `rgba(235, 235, 80, ${opacity})`, // Adjusted
    BRIGHT_ORANGE: (opacity = 1) => `rgba(235, 170, 24, ${opacity})`, // Adjusted
    VERY_DARK_GREY: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`, // Adjusted
    VERY_DARK_GREY2: (opacity = 1) => `rgba(160, 160, 160, ${opacity})`, // Adjusted
    DARK_GREY: (opacity = 1) => `rgba(180, 180, 180, ${opacity})`, // Adjusted
    SOFT_BLUE: (opacity = 1) => `rgba(83, 73, 234, ${opacity})`, // Adjusted
    SOFT_BLUE2: (opacity = 1) => `rgba(63, 105, 145, ${opacity})`, // Adjusted
    VERY_DARK_BLUE: (opacity = 1) => `rgba(37, 71, 103, ${opacity})`, // Adjusted
    GRAYISH_YELLOW: (opacity = 1) => `rgba(92, 91, 87, ${opacity})`, // Adjusted
    VERY_DARK_GRAYISH_YELLOW: (opacity = 1) =>
      `rgba(200, 198, 192, ${opacity})`, // Adjusted
    DARK_GRAYISH_YELLOW: (opacity = 1) => `rgba(180, 179, 175, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_YELLOW: (opacity = 1) => `rgba(133, 128, 110, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_YELLOW2: (opacity = 1) => `rgba(109, 104, 71, ${opacity})`, // Adjusted
    DARK_LIME_GREEN: (opacity = 1) => `rgba(50, 175, 57, ${opacity})`, // Adjusted
    DARK_LIME_GREEN2: (opacity = 1) => `rgba(15, 100, 25, ${opacity})`, // Adjusted
    DARK_LIME_GREEN3: (opacity = 1) => `rgba(3, 65, 47, ${opacity})`, // Adjusted
    VERY_DARK_LIME_GREEN: (opacity = 1) => `rgba(112, 168, 94, ${opacity})`, // Adjusted
    DARK_CYAN: (opacity = 1) => `rgba(0, 163, 124, ${opacity})`, // Unchanged. Gitcoin color
    DARK_RED: (opacity = 1) => `rgba(193, 54, 41, ${opacity})`, // Adjusted
    DARK_RED2: (opacity = 1) => `rgba(189, 50, 50, ${opacity})`, // Adjusted
    GRAY165: (opacity = 1) => `rgba(90, 90, 90, ${opacity})`, // Adjusted
    GRAY170: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`, // Adjusted
    GRAY179: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`, // Adjusted
    GRAY190: (opacity = 1) => `rgba(65, 65, 65, ${opacity})`, // Adjusted
    LIGHT_GRAY199: (opacity = 1) => `rgba(56, 56, 56, ${opacity})`, // Adjusted
    LIGHT_GRAY204: (opacity = 1) => `rgba(85, 85, 85, ${opacity})`, // Adjusted
    LIGHT_GRAY208: (opacity = 1) => `rgba(72, 72, 72, ${opacity})`, // Adjusted
    LIGHT_GRAY211: (opacity = 1) => `rgba(90, 90, 90, ${opacity})`, // Adjusted
    LIGHT_GRAY221: (opacity = 1) => `rgba(85, 85, 85, ${opacity})`, // Adjusted
    LIGHT_GRAY222: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`, // Adjusted
    LIGHT_GRAY223: (opacity = 1) => `rgba(32, 32, 32, ${opacity})`, // Adjusted
    LIGHT_GRAY238: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`, // Adjusted
    LIGHT_GRAY242: (opacity = 1) => `rgba(58, 58, 58, ${opacity})`, // Adjusted
    DARK_GRAY153: (opacity = 1) => `rgba(183, 183, 183, ${opacity})`, // Adjusted
    DARY_GRAYISH_ORANGE: (opacity = 1) => `rgba(140, 133, 125, ${opacity})`, // Adjusted
    DARK_GRAYISH_ORANGE2: (opacity = 1) => `rgba(165, 163, 158, ${opacity})`, // Adjusted
    LIME_GREEN: (opacity = 1) => `rgba(102, 183, 161, ${opacity})`, // Adjusted
    ACTIVE_LIME_GREEN: (opacity = 1) => `rgba(70, 180, 130, ${opacity})`, // Adjusted
    SOFT_LIME_GREEN: (opacity = 1) => `rgba(60, 170, 80, ${opacity})`, // Adjusted
    SOFT_LIME_GREEN2: (opacity = 1) => `rgba(62, 133, 97, ${opacity})`, // Adjusted
    VIVID_ORANGE: (opacity = 1) => `rgba(190, 85, 0, ${opacity})`, // Adjusted
    VERY_PALE_ORANGE: (opacity = 1) => `rgba(128, 100, 70, ${opacity})`, // Adjusted
    SOFT_ORANGE: (opacity = 1) => `rgba(110, 85, 57, ${opacity})`, // Adjusted
    MOSTLY_BLACK_ORANGE: (opacity = 1) => `rgba(128, 126, 123, ${opacity})`, // Adjusted
    VIVID_PINK: (opacity = 1) => `rgba(191, 12, 108, ${opacity})`, // Adjusted
    VIVID_PINK2_UNISWAP_ICON: (opacity = 1) => `rgba(180, 10, 90, ${opacity})`, // Adjusted
    BRIGHT_BLUE: (opacity = 1) => `rgba(40, 90, 215, ${opacity})`, // Adjusted
    BRIGHT_BLUE2: (opacity = 1) => `rgba(40, 45, 150, ${opacity})`, // Adjusted
    BRIGHT_BLUE3: (opacity = 1) => `rgba(32, 67, 125, ${opacity})`, // Adjusted
    PURE_BLUE: (opacity = 1) => `rgba(0, 92, 127, ${opacity})`, // Adjusted
    STRONG_BLUE: (opacity = 1) => `rgba(4, 60, 135, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_PINK: (opacity = 1) => `rgba(80, 78, 79, ${opacity})`, // Adjusted
    LIGHT_GRAYISH_VIOLET: (opacity = 1) => `rgba(72, 70, 73, ${opacity})`, // Adjusted
    VERY_PALE_PINK: (opacity = 1) => `rgba(105, 67, 85, ${opacity})`, // Adjusted
  };
}

export const bountyColors = {
  BADGE_TEXT: colors.ORANGE_DARK2(1),
  BADGE_BACKGROUND: colors.ORANGE_LIGHTER(),
};

export const genericCardColors = {
  BORDER: colors.LIGHT_GREY_BACKGROUND,
  BACKGROUND: colors.LIGHT_GRAY_BACKGROUND(),
};

export const formColors = {
  MESSAGE: colors.BLACK(0.65),
  BACKGROUND: colors.VERY_LIGHT_GREY(),
  BORDER: colors.LIGHT_GREY_BLUE,
  INPUT: colors.ICY_GREY,
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
