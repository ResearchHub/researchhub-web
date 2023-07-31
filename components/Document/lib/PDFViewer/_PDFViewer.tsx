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
import { PDFPageView, EventBus } from "pdfjs-dist/web/pdf_viewer";
import { StyleSheet, css } from "aphrodite";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

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
  onLoadSuccess: ({ numPages, contentRef }) => void;
  onLoadError: (error) => void;
  onPageRender: (pageNum) => void;
}

const PDFViewer = ({
  pdfUrl,
  showWhenLoading,
  onLoadSuccess,
  onLoadError,
  onPageRender,
  viewerWidth = 860,
  contentRef,
  scale,
}: Props) => {

  
  const viewerWidthRef = useRef<number>(viewerWidth);
  const scaleRef = useRef<number>(scale);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReadyToRender, setIsReadyToRender] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [nextPage, setNextPage] = useState<number>(1);
  const [pagesLoaded, setPagesLoaded] = useState<Page[]>([]);
  const [pagesLoading, setPagesLoading] = useState<number[]>([]);
  const observer = useRef<HTMLDivElement>(null);
  const eventBus = new EventBus();

  const loadPage = useCallback(
    async (pageNum) => {
      setPagesLoading([...pagesLoading, pageNum]);
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      const pageContainer = document.createElement("div");
      pageContainer.style.position = "relative";

      const pdfPageView = new PDFPageView({
        container: pageContainer,
        id: pageNum,
        scale: 1.0,
        defaultViewport: viewport,
        eventBus,
        textLayerMode: 2,
      });


      pdfPageView.setPdfPage(page);
      await pdfPageView.draw();

      const pageDiv = pageContainer.querySelector(".page");
      // This refers to PDFjs annotations layer, not our own.
      const annotationsDiv = pageContainer.querySelector(".annotationLayer");

      if (pageDiv) pageDiv.style.margin = "0 auto";
      if (annotationsDiv) annotationsDiv.style.margin = "0 auto";

      // We want to add an ID element to simplify fetching xpath to elements within pdfjs
      // Having an ID shorten the length of the xpath string making it more reliable
      const textLayerDiv = pageContainer.querySelector(".textLayer");
      if (textLayerDiv) {
        textLayerDiv.id = `textLayer-page-${pageNum}`;
        textLayerDiv.style.margin = "0 auto";
      }

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
      onPageRender(pageNum);
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
        console.log("error loading pdf", error);
      }
    };

    loadDocument();
  }, [pdfUrl]);

  useLayoutEffect(() => {
    function updateWidth() {
      setIsReadyToRender(true);
    }

    window.addEventListener("resize", updateWidth);
    updateWidth();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useLayoutEffect(() => {
    const isPageAlreadyLoadedOrLoading =
      pagesLoading.includes(nextPage) ||
      pagesLoaded.filter((p) => p.pageNumber == nextPage).length > 0;

    if (
      nextPage <= numPages &&
      isReadyToRender &&
      !isPageAlreadyLoadedOrLoading
    ) {
      loadPage(nextPage);
    }
  }, [nextPage, loadPage, pdfDocument, numPages, viewerWidth]);

  useEffect(() => {
    if (scale !== scaleRef.current) {
      scaleRef.current = scale;
      viewerWidthRef.current = viewerWidth;

      const _pagesLoading = [...pagesLoaded.map((p) => p.pageNumber)];
      setPagesLoading(_pagesLoading);

      pagesLoaded.forEach(async (page: Page) => {
        page.pdfPageView.update({ scale: scaleRef.current });
        await page.pdfPageView.draw();
      });
    }
  }, [scale]);

  return (
    <div style={{ position: "relative", width: viewerWidthRef.current }} ref={contentRef}>
      <div
        ref={containerRef}
        style={{
          boxSizing: "border-box",
        }}
      ></div>
      {(pagesLoading.length > 0 || !isReadyToRender) && showWhenLoading}
    </div>
  );
};

export default PDFViewer;
