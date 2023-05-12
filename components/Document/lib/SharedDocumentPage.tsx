import HorizontalTabBar from "~/components/HorizontalTabBar";
import { useRouter } from "next/router";
import { getTabs } from "./tabbedNavigation";
import { StyleSheet, css } from "aphrodite";
import DocumentHeader from "../DocumentHeaderV2";
import config from "~/components/Document/lib/config";
import { GenericDocument } from "./types";
import { useState, useEffect, useRef } from "react";

interface Args {
  document: GenericDocument;
  errorCode?: number;
  documentType: string;
  tabName?: string;
  children?: any;
}

const SharedDocumentPage = ({ document, documentType, tabName, children, errorCode }: Args) => {

  const router = useRouter();
  const tabs = getTabs({ router, document });
  const [stickyVisible, setStickyVisible] = useState(false);
  const headerWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const headerWrapperBottom = headerWrapperRef.current?.getBoundingClientRect().bottom;
      if (headerWrapperBottom !== undefined && headerWrapperBottom <= 0) {
        setStickyVisible(true);
      } else {
        console.log('hide sticky')
        setStickyVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <div className={css(styles.pageWrapper)}>
      <div className={css(styles.topArea)}>
        <div className={css(styles.headerWrapper)} ref={headerWrapperRef}>

          <div className={css(styles.headerContentWrapper)}>
            <DocumentHeader document={document} />
            <div>
              <HorizontalTabBar tabs={tabs} />
            </div>
          </div>
        </div>
        <div className={css(styles.stickyHeader, stickyVisible && styles.stickyVisible)}>
          Fixed header
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
    paddingTop: 25,
  },
  headerWrapper: {
    display: "flex",
    justifyContent: "center",
    borderBottom: `2px solid ${config.border}`,
  },
  stickyHeader: {
    position: "fixed",
    display: "none",
    top: 0,
    opacity: 0,
    transition: "opacity 0.5s ease-in-out",
  },
  stickyVisible: {
    display: "block",
    opacity: 1,
  },
  headerContentWrapper: {
    width: config.maxWidth,
  },
  bodyArea: {
    display: "flex",
    justifyContent: "center",
    marginTop: 25,
  },
  bodyContentWrapper: {
    width: config.maxWidth,
  }
});

export default SharedDocumentPage;
