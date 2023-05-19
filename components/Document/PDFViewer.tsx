import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import DocumentPlaceholder from "./DocumentPlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/pro-light-svg-icons";
import dynamic from 'next/dynamic';

const _PDFViewer = dynamic(
  () => import('./_PDFViewer'),
  { ssr: false }
);

interface Props {
  pdfUrl?: string;
  maxWidth?: number;
}

const PDFViewer = ({ pdfUrl, maxWidth = 900 }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);

  function onLoadSuccess() {
    setIsLoading(false);
  }

  function onLoadError() {
    setIsLoading(false);
    setHasLoadError(true);
  }

  if (hasLoadError) {
    return (
      <div
        className={css(styles.error)}>
        <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: 44 }} />
        <span style={{ fontSize: 22 }}>
          There was an error loading the PDF.
        </span>
      </div>
    );
  }
  
  return (
    <>
      {isLoading && <DocumentPlaceholder />}
      <_PDFViewer pdfUrl={pdfUrl} maxWidth={maxWidth} onLoadSuccess={onLoadSuccess} onLoadError={onLoadError} />
    </>
  )
    
  };

  const styles = StyleSheet.create({
    container: {},
    error: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      alignItems: "center",
      rowGap: "15px",
      justifyContent: "center",
      marginTop: "30%",
    }
});

export default PDFViewer;
