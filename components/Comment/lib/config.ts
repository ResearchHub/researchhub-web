import { breakpoints } from "~/config/themes/screen";

const config = {
  pageSize: 20,
  sidebar: {
    width: 500
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
