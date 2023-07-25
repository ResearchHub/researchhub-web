/*
 * WARNING 1: Do not use this component directly.
 * Use DocumentViewer component instead since it is capable of properly loading it.
 * Failure to do so, will result in a very large bundle size.
 *
 * WARNING 2: Refrain from modifying the HTML structure of this component.
 * Rendering annotations uses xpath and if this component's structure is modified, it may result
 * in orphaned annotations which we are unable to render.
 * Adding a mechanism to find and re-attach orphaned annotations is possible but not trivial.
 */

import { Document, Outline, Page, pdfjs } from "react-pdf";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, css } from "aphrodite";

// FIXME: Replace with local worker.
// Needs to set up a custom webpack config to do this.
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  pdfUrl?: string;
  viewerWidth?: number;
  contentRef: any;
  showWhenLoading?: any;
  searchText?: string;
  onLoadSuccess: ({ numPages, contentRef }) => void;
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
  viewerWidth = 900,
  contentRef,
}: Props) => {
  const [numPages, setNumPages] = useState<null | number>(null);
  const [pagesRendered, setPagesRendered] = useState<number>(1); // Start by rendering one page
  const observer = useRef(null); // Observe the last rendered page to see if it's in view, if not, load more pages
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsDocumentLoaded(true);
  }

  function onDocumentLoadError() {
    onLoadError();
  }

  useEffect(() => {
    if (isDocumentLoaded && numPages !== null && contentRef?.current) {
      // All dependencies are ready.
      onLoadSuccess({ numPages, contentRef });
    }
  }, [contentRef, numPages, isDocumentLoaded]);

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

  const pageRenderSuccess = (page) => {
    onPageRender(page._pageIndex + 1);
  };

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
        className
      >
        <div className="content" ref={contentRef}>
          {Array.from(new Array(pagesRendered), (el, index) => (
            <div
              ref={index + 1 === pagesRendered ? lastPageRef : null}
              key={`page_${index + 1}`}
            >
              <Page
                pageNumber={index + 1}
                width={viewerWidth}
                // customTextRenderer={textRenderer}
                onRenderSuccess={pageRenderSuccess}
                loading={showWhenLoading || "Loading..."}
              />
            </div>
          ))}
        </div>
      </Document>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PDFViewer;
