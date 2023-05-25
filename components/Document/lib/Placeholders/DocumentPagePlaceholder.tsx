import { StyleSheet, css } from "aphrodite";
import DocumentPlaceholder from "./DocumentPlaceholder";
import DocumentHeaderPlaceholder from "./DocumentHeaderPlaceholder";
import config from "../config";
import { LEFT_MIN_NAV_WIDTH } from "~/components/ReferenceManager/basic_page_layout/BasicTogglableNavbarLeft";
import { breakpoints } from "~/config/themes/screen";

const DocumentPagePlaceholder = () => {
  return (
    <div className={css(styles.container)}>
      <DocumentHeaderPlaceholder />
      <div className={css(styles.body)}>
        <DocumentPlaceholder />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: "0 auto",
    maxWidth: config.maxWidth,
    width: "100%",
    [`@media only screen and (max-width: ${
      config.maxWidth + LEFT_MIN_NAV_WIDTH
    }px)`]: {
      width: `calc(100vw - ${LEFT_MIN_NAV_WIDTH + 30}px)`,
      paddingLeft: 30,
      boxSizing: "border-box",
      paddingRight: 30,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  body: {
    marginTop: 50,
  },
  header: {},
});

export default DocumentPagePlaceholder;
