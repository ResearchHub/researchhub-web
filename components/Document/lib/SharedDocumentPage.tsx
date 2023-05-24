import { StyleSheet, css } from "aphrodite";
import DocumentHeader from "../DocumentHeaderV2";
import config from "~/components/Document/lib/config";
import { GenericDocument } from "./types";

interface Args {
  document: GenericDocument;
  errorCode?: number;
  documentType: string;
  tabName?: string;
  children?: any;
}

const SharedDocumentPage = ({
  document,
  documentType,
  tabName,
  children,
  errorCode,
}: Args) => {
  return (
    <div className={css(styles.pageWrapper)}>
      <div className={css(styles.topArea)}>
        <DocumentHeader document={document} />
      </div>
      <div className={css(styles.bodyArea)}>
        <div className={css(styles.bodyContentWrapper)}>{children}</div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    height: "100%",
    background: config.background,
  },
  topArea: {
    background: "white",
    paddingTop: 25,
  },
  bodyArea: {
    display: "flex",
    justifyContent: "center",
    marginTop: 25,
  },
  bodyContentWrapper: {
    width: config.maxWidth,
  },
});

export default SharedDocumentPage;
