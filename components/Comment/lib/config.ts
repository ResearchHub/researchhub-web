import { breakpoints } from "~/config/themes/screen";

const config = {
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
