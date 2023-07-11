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
    previewMaxChars: 150,
  },
};

export const apiConfig = {
  feed: {
    pageSize: 15,
    childPageSize: 9,
    repliesPageSize: 7,
  },
};

const config = {
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
  annotation: {
    sidebarBuffer: 15,
    sidebarCommentWidth: 260,
    inlineCommentWidth: 450,
  },
};

export const getConfigForContext = (context: COMMENT_CONTEXTS) => {
  const _config = contextConfig[(context || "").toLowerCase() || "generic"];
  return _config || contextConfig["generic"];
};

export default config;
