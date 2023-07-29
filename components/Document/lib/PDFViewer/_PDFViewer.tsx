// /*
//  * WARNING 1: Do not use this component directly.
//  * Use DocumentViewer component instead since it is capable of properly loading it.
//  * Failure to do so, will result in a very large bundle size.
//  *
//  * WARNING 2: Refrain from modifying the HTML structure of this component.
//  * Rendering annotations uses xpath and if this component's structure is modified, it may result
//  * in orphaned annotations which we are unable to render.
//  * Adding a mechanism to find and re-attach orphaned annotations is possible but not trivial.
//  */

// import { Document, Outline, Page, pdfjs } from "react-pdf";
// import { use, useCallback, useEffect, useRef, useState } from "react";
// import { StyleSheet, css } from "aphrodite";

// // FIXME: Replace with local worker.
// // Needs to set up a custom webpack config to do this.
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// interface Props {
//   pdfUrl?: string;
//   viewerWidth?: number;
//   contentRef: any;
//   showWhenLoading?: any;
//   searchText?: string;
//   onLoadSuccess: ({ numPages, contentRef }) => void;
//   onLoadError: () => void;
//   onPageRender: (pageNum) => void;
// }

// const PDFViewer = ({
//   pdfUrl,
//   showWhenLoading,
//   searchText = "",
//   onLoadSuccess,
//   onLoadError,
//   onPageRender,
//   viewerWidth = 900,
//   contentRef,
// }: Props) => {
//   const [numPages, setNumPages] = useState<null | number>(null);
//   const [pagesRendered, setPagesRendered] = useState<number>(1); // Start by rendering one page
//   const observer = useRef(null); // Observe the last rendered page to see if it's in view, if not, load more pages
//   const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//     setIsDocumentLoaded(true);
//   }

//   function onDocumentLoadError() {
//     onLoadError();
//   }

//   useEffect(() => {
//     if (isDocumentLoaded && numPages !== null && contentRef?.current) {
//       // All dependencies are ready.
//       onLoadSuccess({ numPages, contentRef });
//     }
//   }, [contentRef, numPages, isDocumentLoaded]);

//   const lastPageRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       // @ts-ignore
//       if (observer.current) observer.current.disconnect();
//       // @ts-ignore
//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && pagesRendered < (numPages ?? 0)) {
//           setPagesRendered((prev) => prev + 1);
//         }
//       });
//       // @ts-ignore
//       if (node) observer.current.observe(node);
//     },
//     [pagesRendered, numPages]
//   );

//   const pageRenderSuccess = (page) => {
//     onPageRender(page._pageIndex + 1);
//   };

//   const BORDER_WIDTH = 2;
//   return (
//     <div
//       style={{
//         width: viewerWidth - BORDER_WIDTH,
//         overflow: "hidden",
//         margin: "0 auto",
//       }}
//     >
//       <Document
//         file={pdfUrl}
//         onLoadSuccess={onDocumentLoadSuccess}
//         onLoadError={onDocumentLoadError}
//         loading={showWhenLoading || "Loading..."}
//         className
//       >
//         <div className="content" ref={contentRef}>
//           {Array.from(new Array(pagesRendered), (el, index) => (
//             <div
//               ref={index + 1 === pagesRendered ? lastPageRef : null}
//               key={`page_${index + 1}`}
//             >
//               <Page
//                 pageNumber={index + 1}
//                 width={viewerWidth}
//                 // customTextRenderer={textRenderer}
//                 onRenderSuccess={pageRenderSuccess}
//                 loading={showWhenLoading || "Loading..."}
//               />
//             </div>
//           ))}
//         </div>
//       </Document>
//     </div>
//   );
// };

// const styles = StyleSheet.create({
//   container: {},
// });

// export default PDFViewer;

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  getDocument,
  GlobalWorkerOptions,
  version,
} from "pdfjs-dist/build/pdf";
import {
  PDFPageView,
  EventBus,
  TextLayerBuilder,
} from "pdfjs-dist/web/pdf_viewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/pro-light-svg-icons";
import { StyleSheet, css } from "aphrodite";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

// interface Props {
//   pdfUrl: string | undefined,
//   showWhenLoading: null | React.ReactNode,
//   scale: number,
//   onLoadSuccess?: Function,
//   onLoadError?: Function,
// }

interface Page {
  pdfPageView: PDFPageView;
  pageNumber: number;
  pageContainer: HTMLDivElement;
}

interface Props {
  pdfUrl?: string;
  viewerWidth?: number;
  contentRef: any;
  showWhenLoading?: any;
  scale: number;
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
  viewerWidth = 860,
  contentRef,
  scale,
}: Props) => {
  console.log("viewerWidth", viewerWidth);
  console.log("scale", scale);
  const viewerWidthRef = useRef<number>(viewerWidth);
  const [currentScale, setCurrentScale] = useState<number>(scale);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReadyToRender, setIsReadyToRender] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [nextPage, setNextPage] = useState<number>(1);
  const [pagesLoaded, setPagesLoaded] = useState<Page[]>([]);
  const [pagesLoading, setPagesLoading] = useState<number[]>([]);
  const observer = useRef<HTMLDivElement>(null);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);
  const eventBus = new EventBus();

  const loadPage = useCallback(
    async (pageNum) => {
      const isAlreadyLoadingOrLoaded =
        pagesLoading.includes(pageNum) ||
        pagesLoaded.filter((p) => p.pageNumber == pageNum).length > 0;

      if (
        pdfDocument &&
        pageNum <= numPages &&
        isReadyToRender &&
        !isAlreadyLoadingOrLoaded
      ) {
        setPagesLoading([...pagesLoading, pageNum]);

        const page = await pdfDocument.getPage(pageNum);

        // Get viewport with scale 1 to find original page size
        const unscaledViewport = page.getViewport({ scale: 1 });
        // // Calculate the new scale
        // const _scale = viewerWidthRef.current / unscaledViewport.width;
        // // Get the scaled viewport
        // const viewport = page.getViewport({ scale: _scale });

        const viewportAspectRatio =
          unscaledViewport.width / unscaledViewport.height;
        const viewerAspectRatio =
          viewerWidthRef.current / unscaledViewport.height;
        const _scale =
          viewerAspectRatio < viewportAspectRatio ? viewerAspectRatio : 1;

        // Get the scaled viewport
        const viewport = page.getViewport({ scale: _scale });

        const pageContainer = document.createElement("div");
        pageContainer.style.position = "relative";

        const pdfPageView = new PDFPageView({
          container: pageContainer,
          id: pageNum,
          scale: _scale,
          defaultViewport: viewport,
          eventBus,
          textLayerMode: 2,
        });

        pdfPageView.setPdfPage(page);
        pdfPageView.div.className = css(styles.page);
        await pdfPageView.draw();

        if (containerRef.current) {
          containerRef.current.appendChild(pageContainer);
        }

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && pageNum < numPages) {
              setNextPage(pageNum + 1);
            }
          },
          {
            rootMargin: "0px 0px -100% 0px",
          }
        );
        observer.current.observe(pageContainer);

        setPagesLoaded([
          ...pagesLoaded,
          {
            pdfPageView,
            pageNumber: pageNum,
            pageContainer,
          },
        ]);
        setPagesLoading(pagesLoading.filter((page) => page !== pageNum));
      }
    },
    [pdfDocument, numPages, scale, eventBus, isReadyToRender]
  );

  useEffect(() => {
    const loadDocument = async () => {
      let pdfDocument;
      try {
        const loadingTask = getDocument(pdfUrl);
        pdfDocument = await loadingTask.promise;
        setPdfDocument(pdfDocument);
        setNumPages(pdfDocument.numPages);
      } catch (error) {
        onLoadError && onLoadError(error);
        setHasLoadError(true);
        console.log("error loading pdf", error);
      }
    };

    loadDocument();
  }, [pdfUrl]);

  useLayoutEffect(() => {
    function updateWidth() {
      const clientWidth = Number(containerRef.current?.clientWidth);
      if (clientWidth > 0) {
        viewerWidthRef.current = clientWidth;
        setIsReadyToRender(true);
      }
    }

    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (pdfDocument && nextPage <= numPages) {
      loadPage(nextPage);
    }
  }, [nextPage, loadPage, pdfDocument, numPages, viewerWidth, currentScale]);

  // useEffect(() => {
  //   if (scale !== currentScale) {
  //     setCurrentScale(scale);

  //     const _pagesLoading = [...pagesLoaded.map(p => p.pageNumber)];
  //     setPagesLoading(_pagesLoading);

  //     pagesLoaded.forEach(async (page:Page) => {
  //       page.pdfPageView.update({ scale });
  //       await page.pdfPageView.draw();
  //     });
  //   }
  // }, [scale]);

  if (hasLoadError) {
    return (
      <div className={css(styles.error)}>
        <FontAwesomeIcon icon={faCircleExclamation} style={{ fontSize: 44 }} />
        <span style={{ fontSize: 22 }}>
          There was an error loading the PDF.
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }} ref={contentRef}>
      <div
        ref={containerRef}
        style={{
          width: viewerWidthRef.current,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      ></div>
      {(pagesLoading.length > 0 || !isReadyToRender) && showWhenLoading}
    </div>
  );
};

const styles = StyleSheet.create({
  error: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    rowGap: "15px",
    justifyContent: "center",
    marginTop: "20%",
  },
  page: {
    margin: "0 auto",
  },
});

export default PDFViewer;
