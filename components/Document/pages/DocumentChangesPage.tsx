import { useContext, useState, useMemo } from "react";
import { NextPage } from "next";
import { StyleSheet, css } from "aphrodite";
import { DocumentContext } from "../lib/DocumentContext";
import { isPaper } from "../lib/types";
import { DocumentMetadata } from "../lib/types";
import AuthorAvatar from "~/components/AuthorAvatar";
import DocumentPageLayout from "./DocumentPageLayout";
import useCacheControl from "~/config/hooks/useCacheControl";
import { useDocument, useDocumentMetadata } from "../lib/useHooks";
import DocumentPagePlaceholder from "../lib/Placeholders/DocumentPagePlaceholder";
import Error from "next/error";
import { useRouter } from "next/router";
import { captureEvent } from "~/config/utils/events";
import config from "~/components/Document/lib/config";
import colors from "~/config/themes/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/pro-light-svg-icons";
import { breakpoints } from "~/config/themes/screen";

type Args = {
    documentData?: any;
    metadata?: any;
    errorCode?: number;
    documentType: DocumentType;
    tabName: string;
};

const DocumentChangesPage: NextPage<Args> = ({
    documentData,
    documentType,
    tabName,
    metadata,
    errorCode,
}) => {
  const router = useRouter();
  const [viewerWidth, setViewerWidth] = useState<number | undefined>(
    config.width
  );  
  const [documentMetadata, setDocumentMetadata] = useDocumentMetadata({
    rawMetadata: metadata,
    unifiedDocumentId: documentData?.unified_document?.id,
  });
  const [document, setDocument] = useDocument({
    rawDocumentData: documentData,
    documentType,
  });
  const { revalidateDocument } = useCacheControl();
  if (router.isFallback) {
    return <DocumentPagePlaceholder />;
  }
  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }

  if (!document || !documentMetadata) {
    captureEvent({
      msg: "[Document] Could not parse",
      data: { document, documentType, documentMetadata },
    });
    return <Error statusCode={500} />;
  }

  const reversedVersions = useMemo(() => {
    if (document && isPaper(document)) {
      return [...document.versions].reverse();
    }
    return [];
  }, [document]);

  return (
    <DocumentContext.Provider
      value={{
        metadata: documentMetadata,
        documentType,
        tabName,
        updateMetadata: setDocumentMetadata,
        updateDocument: setDocument,
      }}
    >
      <DocumentPageLayout
        document={document}
        metadata={documentMetadata}
      >
        <div
          className={css(styles.bodyContentWrapper)}
          style={{ maxWidth: viewerWidth }}
        >
        <div
          className={css(styles.bodyContentWrapper)}
        >
          {isPaper(document) && reversedVersions.map((version) => {
            const isCurrentVersion = String(version.paperId) === router.query.documentId;
            return (
              <div key={version.version} className={css(styles.versionCard)}>
                <div className={css(styles.versionHeader)}>
                  <AuthorAvatar
                    size={32}
                    authorProfile={document.createdBy?.authorProfile}
                  />
                  <div className={css(styles.versionInfo)}>
                    <div className={css(styles.versionLabel)}>
                      {version.formattedLabel}
                      {isCurrentVersion && (
                        <span className={css(styles.currentLabel)}>Current Version</span>
                      )}
                    </div>
                    <div className={css(styles.versionMessage)}>{version.versionMessage}</div>
                  </div>
                  {!isCurrentVersion && (
                    <button 
                      className={css(styles.switchButton)}
                      onClick={() => router.push(`/paper/${version.paperId}`)}
                    >
                      <span className={css(styles.switchButtonText)}>View</span>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </div>        
      </DocumentPageLayout>
    </DocumentContext.Provider>
  );
};

const styles = StyleSheet.create({
  bodyContentWrapper: {
    width: "100%",
    margin: "0 auto",
  },
  versionCard: {
    padding: 16,
    borderRadius: 8,
    border: "1px solid #E0E0E0",
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  versionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  versionInfo: {
    flex: 1,
  },
  versionLabel: {
    fontWeight: 500,
    color: "#2a2a2a",
    display: "flex",
    alignItems: "center",
    marginBottom: 4,
  },
  versionMessage: {
    color: "#666",
    fontSize: 14,
    lineHeight: "1.4",
  },
  currentLabel: {
    marginLeft: 8,
    fontSize: 12,
    padding: "2px 8px",
    borderRadius: 4,
    backgroundColor: "#E3F2FD",
    color: "#1976D2",
  },
  switchButton: {
    marginLeft: "auto",
    padding: "6px 12px",
    borderRadius: 4,
    border: `1px solid ${colors.NEW_BLUE()}`,
    backgroundColor: "white",
    color: colors.NEW_BLUE(),
    cursor: "pointer",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    gap: 8,
    ":hover": {
      backgroundColor: "#F5F9FF",
    },
    [`@media (max-width: ${breakpoints.mobile.str})`]: {
      padding: "6px",
      minWidth: 32,
      justifyContent: "center",
    },
  },
  switchButtonText: {
    [`@media (max-width: ${breakpoints.mobile.str})`]: {
      display: "none",
    },
  },
});

export default DocumentChangesPage;