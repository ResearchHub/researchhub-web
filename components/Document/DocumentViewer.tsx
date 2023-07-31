import config from "./lib/config";
import { GenericDocument } from "./lib/types";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

interface Props {
  document: GenericDocument;
}

const DocumentViewer = ({ document }: Props) => {
  return <div className={css(styles.container)}></div>;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: "4px",
    border: `1px solid ${config.border}`,
    marginTop: 15,
    minHeight: 1500,
    background: colors.WHITE(),
  },
});

export default DocumentViewer;
