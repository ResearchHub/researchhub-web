import { breakpoints } from "~/config/themes/screen";

const config = {
  feed: {
    rootLevelPageSize: 5,
    childPageSize: 3,
    repliesPageSize: 1,
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
