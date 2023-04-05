import { breakpoints } from "~/config/themes/screen";

const config = {
  feed: {
    rootLevelPageSize: 15,
    childPageSize: 5,
    repliesPageSize: 4,
  },
  drawer: {
    displayForBreakpoint: breakpoints.small.int,
    previewMaxChars: 375,
  },
  sidebar: {
    previewMaxChars: 375,
    fixedPosMaxWidth: 1550,
  },
  default: {
    previewMaxChars: 700,
  },
  comment: {
    placeholderCount: 8,
    minLength: 20,
  },
};

export const getConfigForContext = (context: "sidebar" | "default" | "drawer" | undefined | null) => {
  const _config = config[context || "default"];
  return _config || config["default"];
}

export default config;
