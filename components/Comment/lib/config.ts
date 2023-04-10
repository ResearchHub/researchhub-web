import { breakpoints } from "~/config/themes/screen";

const config = {
  feed: {
    rootLevelPageSize: 15,
    childPageSize: 7,
    repliesPageSize: 4,
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
  default: {
    previewMaxChars: 700,
    previewMaxImages: 2,
  },
  liveFeed: {
    previewMaxChars: 500,
    previewMaxImages: 1,
  },
  toggle: {
    width: 75
  },
  comment: {
    placeholderCount: 8,
    minLength: 15,
  },
};

export const getConfigForContext = (context: "sidebar" | "default" | "drawer" | undefined | null) => {
  const _config = config[context || "default"];
  return _config || config["default"];
}

export default config;
