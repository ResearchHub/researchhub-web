import { breakpoints } from "~/config/themes/screen";

const config = {
  feed: {
    rootLevelPageSize: 15,
    childPageSize: 5,
    repliesPageSize: 4,
  },
  drawer: {
    displayForBreakpoint: breakpoints.small.int,
  },
  comment: {
    previewMaxChars: 350,
    placeholderCount: 8,
    minLength: 20,
  },
};

export default config;
