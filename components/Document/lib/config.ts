import globalColors from "~/config/themes/colors";

const config = {
  width: 860,
  background: "#FCFCFC",
  controlsWidth: 260,
  border: globalColors.GREY_LINE(1.0),
  // This used to be 3 (and not "all"),
  // but we wanted to give the user the ability to scroll to anchor links,
  // e.g. "some claim [1]", and clicking on [1] would scroll to the reference at the end.
  // and the simplest way to enable that was to preload all pages.
  numPdfPagesToPreload: "all",
};

export default config;
