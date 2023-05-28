import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist/build/pdf';
import { PDFPageView, EventBus, TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

function PdfViewer({ pdfUrl, scale = 1.0 }) {
  const containerRef = useRef();
  const [numPages, setNumPages] = useState(0);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [pagesRendered, setPagesRendered] = useState(0); // Start with the first page
  const observer = useRef(null); // Observe the last rendered page to see if it's in view, if not, load more pages
  const eventBus = new EventBus();
console.log('pagesRendered: ', pagesRendered)

  const loadPage = useCallback(async (pageNum) => {
    if (pdfDocument && pageNum <= numPages) {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale });
  
      const pageContainer = document.createElement('div');
      pageContainer.style.position = 'relative';
  
      const pdfPageView = new PDFPageView({
        container: pageContainer,
        id: pageNum,
        scale,
        defaultViewport: viewport,
        eventBus,
        textLayerMode: 2,
      });
  
      pdfPageView.setPdfPage(page);
      await pdfPageView.draw();
  
      if (containerRef.current) {
        containerRef.current.appendChild(pageContainer);
      }
      
      // Observe the new page, don't compare pageNum and pagesRendered
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagesRendered < numPages) {
          setPagesRendered((prev) => prev + 1);
          // console.log('loading...')
          // loadPage(pagesRendered + 1);
        }
      }, {
        rootMargin: "0px 0px -100% 0px"
      });
      observer.current.observe(pageContainer);
    }
  }, [pdfDocument, pagesRendered, numPages, scale, eventBus]);
  
  
  
  
  


  

  useEffect(() => {
    const loadDocument = async () => {
      const loadingTask = getDocument(pdfUrl);
      const pdfDocument = await loadingTask.promise;
      setPdfDocument(pdfDocument);
      setNumPages(pdfDocument.numPages);
      loadPage(1);  // load first page right away
    };

    loadDocument();
  }, [pdfUrl]);

  useEffect(() => {
    if (pdfDocument && pagesRendered < numPages) {
      console.log('|||||||')
      loadPage(pagesRendered + 1);
    }
  }, [numPages, loadPage, pdfDocument, pagesRendered]);

  return <div ref={containerRef} style={{ position: 'relative' }} />;
}

export default PdfViewer;









// /*
//  * Important Note: Do not use this component directly.
//  * Use PDFViewer component instead since it is capable of properly loading it.
//  * Failure to do so, will result in a very large bundle size.
//  */

// import { Document, Outline, Page, pdfjs } from "react-pdf";
// import { useCallback, useRef, useState } from "react";
// import { StyleSheet, css } from "aphrodite";

// // FIXME: Replace with local worker.
// // Needs to set up a custom webpack config to do this.
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// interface Props {
//   pdfUrl?: string;
//   viewerWidth?: number;
//   showWhenLoading?: any;
//   searchText?: string;
//   onLoadSuccess: () => void;
//   onLoadError: () => void;
// }

// const PDFViewer = ({
//   pdfUrl,
//   showWhenLoading,
//   searchText = "",
//   onLoadSuccess,
//   onLoadError,
//   viewerWidth = 900,
// }: Props) => {
//   const [numPages, setNumPages] = useState<null | number>(null);
//   const [pagesRendered, setPagesRendered] = useState<number>(1); // Start by rendering one page
//   const observer = useRef(null); // Observe the last rendered page to see if it's in view, if not, load more pages

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//     onLoadSuccess();
//   }

//   function onDocumentLoadError() {
//     onLoadError();
//   }

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

//   // function onItemClick({ pageNumber: itemPageNumber }) {
//   //   setPageNumber(itemPageNumber);
//   // }

//   function highlightPattern(text, pattern) {
//     const words = pattern.split(" ");
//     const regexPattern = words.join("|");
//     const regex = new RegExp(regexPattern, "gi");
//     return text.replace(regex, (value) => `<mark>${value}</mark>`);
//   }

//   const textRenderer = useCallback(
//     (textItem) => highlightPattern(textItem.str, searchText),
//     [searchText]
//   );

//   return (
//     <div
//       style={{ width: viewerWidth - 2, overflow: "hidden", margin: "0 auto" }}
//     >
//       <Document
//         file={pdfUrl}
//         onLoadSuccess={onDocumentLoadSuccess}
//         onLoadError={onDocumentLoadError}
//         loading={showWhenLoading || "Loading..."}
//       >
//         {/* <div className="outline">
//           <Outline onItemClick={() => null} />
//         </div> */}
//         {/* <Page key={`page_1`} pageNumber={1} customTextRenderer={textRenderer} onLoadSuccess={removeTextLayerOffset} width={900}/> */}

//         {Array.from(new Array(pagesRendered), (el, index) => (
//           <div
//             ref={index + 1 === pagesRendered ? lastPageRef : null}
//             key={`page_${index + 1}`}
//           >
//             <Page
//               pageNumber={index + 1}
//               width={viewerWidth}
//               customTextRenderer={textRenderer}
//               loading={showWhenLoading || "Loading..."}
//             />
//           </div>
//         ))}
//       </Document>
//     </div>
//   );
// };

// const styles = StyleSheet.create({
//   container: {},
// });

// export default PDFViewer;
