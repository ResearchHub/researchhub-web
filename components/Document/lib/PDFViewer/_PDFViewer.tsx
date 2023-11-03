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
import config from "~/components/Document/lib/config";

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
  numPagesToPreload?: number;
  showWhenLoading?: any;
  scale: number;
  onReady?: ({ numPages }) => void;
  onLoadError: (error) => void;
  onPageRender: ({ pageNumber }: { pageNumber: number }) => void;
}

const PDFViewer = ({
  pdfUrl,
  showWhenLoading,
  onReady,
  numPagesToPreload = config.numPdfPagesToPreload,
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
  const [pagesLoading, setPagesLoading] = useState<number[]>([]);
  const pagesLoadingRef = useRef<number[]>([]);
  const [pageBuffer, setPageBuffer] = useState<{ [pageNumber: number]: Page }>(
    {}
  );
  const [renderedPages, setRenderedPages] = useState<{
    [pageNumber: number]: Page;
  }>({});
  const observer = useRef<HTMLDivElement>(null);
  const eventBus = new EventBus();

  const loadPage = useCallback(
    async (pageNumber) => {
      setPagesLoading((prevPagesLoading) => {
        if (prevPagesLoading.includes(pageNumber)) {
          pagesLoadingRef.current = prevPagesLoading;
          return prevPagesLoading;
        }

        pagesLoadingRef.current = [...prevPagesLoading, pageNumber];
        return [...prevPagesLoading, pageNumber];
      });

      const page = await pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale: scaleRef.current });
      const pageContainer = document.createElement("div") as HTMLDivElement;
      pageContainer.style.position = "relative";

      const pdfPageView = new PDFPageView({
        container: pageContainer,
        id: pageNumber,
        scale: scaleRef.current,
        defaultViewport: viewport,
        eventBus,
        textLayerMode: 1,
      });

      pdfPageView.setPdfPage(page);
      await pdfPageView.draw();

      const pageDiv = pageContainer.querySelector(".page") as HTMLDivElement;
      const annotationsDiv = pageContainer.querySelector(
        ".annotationLayer"
      ) as HTMLDivElement;

      if (pageDiv) pageDiv.style.margin = "0 auto";
      if (annotationsDiv) annotationsDiv.style.display = "none";

      const textLayerDiv = pageContainer.querySelector(
        ".textLayer"
      ) as HTMLDivElement;
      if (textLayerDiv) {
        textLayerDiv.id = `textLayer-page-${pageNumber}`;
        textLayerDiv.style.margin = "0 auto";
      }

      setPageBuffer((prevPageBuffer) => {
        return {
          ...prevPageBuffer,
          [pageNumber]: { pdfPageView, pageNumber, pageContainer },
        };
      });

      setPagesLoading((prevPagesLoading) =>
        prevPagesLoading.filter((page) => page !== pageNumber)
      );
    },

    [pdfDocument, numPages, eventBus, isReadyToRender]
  );

  useEffect(() => {
    const loadDocument = async () => {
      let pdfDocument;
      try {
        const loadingTask = getDocument(pdfUrl);
        pdfDocument = await loadingTask.promise;
        setPdfDocument(pdfDocument);
        setNumPages(pdfDocument.numPages);
        onReady && onReady({ numPages: pdfDocument.numPages });
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

  useEffect(() => {
    const isPageAlreadyLoadedOrLoading =
      pageBuffer[nextPage] || pagesLoadingRef.current.includes(nextPage);

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

      const redrawPagePromises = Object.keys(renderedPages).map(
        async (pageNumber, index) => {
          const page = renderedPages[pageNumber];
          page.pdfPageView.update({ scale: scaleRef.current });
          await page.pdfPageView.draw();
          onPageRender({ pageNumber: parseInt(pageNumber) });
        }
      );

      Promise.all(redrawPagePromises).then(() => {
        setPagesLoading([]);
      });
    }
  }, [scale]);

  useEffect(() => {
    if (pageBuffer[nextPage]) {
      const page = pageBuffer[nextPage];
      if (containerRef.current) {
        containerRef.current.appendChild(page.pageContainer);
      }
      const { [nextPage]: _, ...newPageBuffer } = pageBuffer;
      setPageBuffer(newPageBuffer);

      setRenderedPages((prevRenderedPages) => {
        return {
          ...prevRenderedPages,
          [nextPage]: page,
        };
      });

      if (nextPage <= numPagesToPreload) {
        setNextPage((prevNextPage) => prevNextPage + 1);
      }

      setTimeout(() => {
        onPageRender({ pageNumber: nextPage }); // call the callback here
      }, 0);

      // @ts-ignore
      if (observer.current) observer.current.disconnect();
      // @ts-ignore
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && nextPage < numPages) {
            setNextPage(nextPage + 1);
          }
        },
        {
          rootMargin: "-10px",
        }
      );
      // @ts-ignore
      observer.current.observe(page.pageContainer);
    }
  }, [pageBuffer, nextPage, numPages, numPagesToPreload]);

  return (
    <div
      style={{ position: "relative", width: viewerWidthRef.current }}
      ref={contentRef}
    >
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
