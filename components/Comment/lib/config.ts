import { breakpoints } from "~/config/themes/screen";
import { COMMENT_CONTEXTS } from "./types";

export const contextConfig = {
  generic: {
    previewMaxChars: 1500,
    previewMaxImages: 2,
  },
  drawer: {
    displayForBreakpoint: breakpoints.small.int,
    previewMaxChars: 375,
    previewMaxImages: 1,
  },
  sidebar: {
    previewMaxChars: 375,
    previewMaxImages: 1,
    fixedPosMaxWidth: 1550,
    width: 500,
  },
  feed: {
    previewMaxChars: 500,
    previewMaxImages: 1,
  },
  annotation: {
    commentWidth: 300,
    previewMaxChars: 150,
  },
};

const config = {
  feed: {
    rootLevelPageSize: 15,
    childPageSize: 9,
    repliesPageSize: 7,
  },
  toggle: {
    width: 75,
  },
  comment: {
    placeholderCount: 8,
    minLength: 15,
  },
  textSelectionMenu: {
    height: 100,
    width: 50,
  },
};

export const getConfigForContext = (context: COMMENT_CONTEXTS) => {
  const _config = contextConfig[(context || "").toLowerCase() || "generic"];
  return _config || contextConfig["generic"];
};

export default config;
