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
  onLoadSuccess?: ({ numPages, contentRef }) => void;
  onLoadError: (error) => void;
  onPageRender: ({ pageNum }: { pageNum: number }) => void;
}

const PDFViewer = ({
  pdfUrl,
  showWhenLoading,
  onLoadSuccess,
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
  const [pageBuffer, setPageBuffer] = useState<{ [pageNum: number]: Page }>({});
  const observer = useRef<HTMLDivElement>(null);
  const eventBus = new EventBus();

  const loadPage = useCallback(
    async (pageNum) => {
      setPagesLoading((prevPagesLoading) => {
        if (prevPagesLoading.includes(pageNum)) {
          pagesLoadingRef.current = prevPagesLoading;
          return prevPagesLoading;
        }

        pagesLoadingRef.current = [...prevPagesLoading, pageNum];
        return [...prevPagesLoading, pageNum];
      });

      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: scaleRef.current });
      const pageContainer = document.createElement("div") as HTMLDivElement;
      pageContainer.style.position = "relative";

      const pdfPageView = new PDFPageView({
        container: pageContainer,
        id: pageNum,
        scale: scaleRef.current,
        defaultViewport: viewport,
        eventBus,
        textLayerMode: 2,
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
        textLayerDiv.id = `textLayer-page-${pageNum}`;
        textLayerDiv.style.margin = "0 auto";
      }

      setPageBuffer((prevPageBuffer) => {
        return {
          ...prevPageBuffer,
          [pageNum]: { pdfPageView, pageNumber: pageNum, pageContainer },
        };
      });

      setPagesLoading((prevPagesLoading) =>
        prevPagesLoading.filter((page) => page !== pageNum)
      );
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

      Object.keys(pageBuffer).forEach(async (pageNumber, index) => {
        const page = pageBuffer[pageNumber];
        page.pdfPageView.update({ scale: scaleRef.current });
        await page.pdfPageView.draw();
        onPageRender({ pageNum: index + 1 });
      });

      setPagesLoading([]);
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
      if (nextPage <= numPagesToPreload) {
        console.log("nextPage", nextPage);
        setNextPage((prevNextPage) => prevNextPage + 1);
      }

      setTimeout(() => {
        onPageRender({ pageNum: nextPage }); // call the callback here
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
          rootMargin: "0px 0px -100% 0px",
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
