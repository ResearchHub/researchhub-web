import HorizontalTabBar from "~/components/HorizontalTabBar";
import { useRouter } from "next/router";
import Error from "next/error";
import { getTabs } from "./tabbedNavigation";
import { StyleSheet, css } from "aphrodite";
import DocumentHeader from "../DocumentHeaderV2";
import { TopLevelDocument } from "~/config/types/root_types";

interface Args {
  document: TopLevelDocument;
  errorCode?: number;
  documentType: string;
  tabName?: string;
  children?: any;
}

const SharedDocumentPage = ({ document, documentType, tabName, children, errorCode }: Args) => {

  console.log('document', document)
  console.log('documentType', documentType)
  console.log('tabName', tabName)

  const router = useRouter();
  const tabs = getTabs({ router });

  return (
    <div className={css(styles.pageWrapper)}>
      <div className={css(styles.headerWrapper)}>
        <DocumentHeader document={document} />
        <HorizontalTabBar tabs={tabs} />
      </div>
      <div className={css(styles.bodyWrapper)}>
        {children}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    background: "#FCFCFC",
  },
  headerWrapper: {
    background: "white",
  },
  bodyWrapper: {

  }
});

export default SharedDocumentPage;
