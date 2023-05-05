import HorizontalTabBar from "~/components/HorizontalTabBar";
import { useRouter } from "next/router";
import Error from "next/error";
import { getTabs } from "./tabbedNavigation";
import { StyleSheet, css } from "aphrodite";
import DocumentHeader from "../DocumentHeaderV2";
import { TopLevelDocument } from "~/config/types/root_types";
import globalColors from "~/config/themes/colors";

interface Args {
  document: TopLevelDocument;
  errorCode?: number;
  documentType: string;
  tabName?: string;
  children?: any;
}

const config = {
  width: 868,
  background: "#FCFCFC",
  border: globalColors.GREY_LINE(1.0),
}

const SharedDocumentPage = ({ document, documentType, tabName, children, errorCode }: Args) => {

  console.log('document', document)
  console.log('documentType', documentType)
  console.log('tabName', tabName)

  const router = useRouter();
  const tabs = getTabs({ router });

  return (
    <div className={css(styles.pageWrapper)}>
      <div className={css(styles.topArea)}>
        <div className={css(styles.headerWrapper)}>
          <div className={css(styles.headerContentWrapper)}>
            <DocumentHeader document={document} />
            <HorizontalTabBar tabs={tabs} />
          </div>
        </div>
      </div>
      <div className={css(styles.bodyArea)}>
        <div className={css(styles.bodyContentWrapper)}>
          {children}
        </div>
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
  },
  headerWrapper: {
    display: "flex",
    justifyContent: "center",
    borderBottom: `2px solid ${config.border}`,
  },
  headerContentWrapper: {
    width: config.width,
  },
  bodyArea: {
    display: "flex",
    justifyContent: "center",
    marginTop: 25,
  },
  bodyContentWrapper: {
    width: config.width,
  }
});

export default SharedDocumentPage;
