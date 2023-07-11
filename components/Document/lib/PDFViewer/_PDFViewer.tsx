/*
 * Important Note: Do not use this component directly.
 * Use PDFViewer component instead since it is capable of properly loading it.
 * Failure to do so, will result in a very large bundle size.
 */

import { Document, Outline, Page, pdfjs } from "react-pdf";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import config from "../config";

// FIXME: Replace with local worker.
// Needs to set up a custom webpack config to do this.
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  pdfUrl?: string;
  viewerWidth?: number;
  showWhenLoading?: any;
  searchText?: string;
  onLoadSuccess: () => void;
  onLoadError: () => void;
  onPageRender: (pageNum) => void;
}

const PDFViewer = ({
  pdfUrl,
  showWhenLoading,
  searchText = "",
  onLoadSuccess,
  onLoadError,
  onPageRender,
  viewerWidth = config.width,
}: Props) => {
  const [numPages, setNumPages] = useState<null | number>(null);
  const [pagesRendered, setPagesRendered] = useState<number>(1); // Start by rendering one page
  const observer = useRef(null); // Observe the last rendered page to see if it's in view, if not, load more pages

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    onLoadSuccess();
  }

  function onDocumentLoadError() {
    onLoadError();
  }

  const lastPageRef = useCallback(
    (node: HTMLDivElement | null) => {
      // @ts-ignore
      if (observer.current) observer.current.disconnect();
      // @ts-ignore
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagesRendered < (numPages ?? 0)) {
          setPagesRendered((prev) => prev + 1);
        }
      });
      // @ts-ignore
      if (node) observer.current.observe(node);
    },
    [pagesRendered, numPages]
  );

  function highlightPattern(text, pattern) {
    const words = pattern.split(" ");
    const regexPattern = words.join("|");
    const regex = new RegExp(regexPattern, "gi");
    return text.replace(regex, (value) => `<mark>${value}</mark>`);
  }

  const textRenderer = useCallback(
    (textItem) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  const BORDER_WIDTH = 2;
  return (
    <div
      style={{
        width: viewerWidth - BORDER_WIDTH,
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={showWhenLoading || "Loading..."}
      >
        {Array.from(new Array(pagesRendered), (el, index) => (
          <div
            ref={index + 1 === pagesRendered ? lastPageRef : null}
            key={`page_${index + 1}`}
          >
            <Page
              pageNumber={index + 1}
              width={viewerWidth}
              customTextRenderer={textRenderer}
              onRenderSuccess={() => onPageRender(index + 1)}
              loading={showWhenLoading || "Loading..."}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PDFViewer;
