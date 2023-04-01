import { breakpoints } from "~/config/themes/screen";

const config = {
  feed: {
    rootLevelPageSize: 15,
    childPageSize: 3,
    repliesPageSize: 3,
  },
  drawer: {
    displayForBreakpoint: breakpoints.small.int,
  },
  comment: {
    previewMaxChars: 350,
    placeholderCount: 8,
    minLength: 20,
  },
  toggle: {
    elemToMountAt: "documentRoot",
  },
};

export default config;
