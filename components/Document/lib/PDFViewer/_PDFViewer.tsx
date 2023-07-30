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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/pro-light-svg-icons";
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
  const viewerWidthRef = useRef<number>(viewerWidth);
  const scaleRef = useRef<number>(scale);
  // const [currentScale, setCurrentScale] = useState<number>(scale);
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
      setPagesLoading([...pagesLoading, pageNum]);
      const page = await pdfDocument.getPage(pageNum);

      const unscaledViewport = page.getViewport({ scale: scaleRef.current });
      const viewportAspectRatio =
        unscaledViewport.width / unscaledViewport.height;
      const viewerAspectRatio =
        viewerWidthRef.current / unscaledViewport.height;
      const _scale = viewerAspectRatio;
      // viewerAspectRatio < viewportAspectRatio ? viewerAspectRatio : 1.0;
      // Get the scaled viewport
      const viewport = page.getViewport({ scale: scaleRef.current });

      console.log("----------------------------------------------");
      console.log("_scale", _scale);
      console.log("unscaledViewport.width", unscaledViewport.width);
      console.log("viewerAspectRatio", viewerAspectRatio);

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
      viewerWidthRef.current = scaleRef.current * viewerWidth;

      const _pagesLoading = [...pagesLoaded.map((p) => p.pageNumber)];
      setPagesLoading(_pagesLoading);

      pagesLoaded.forEach(async (page: Page) => {
        page.pdfPageView.update({ scale: scaleRef.current });
        await page.pdfPageView.draw();
      });
    }
  }, [scale]);

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
          // width: viewerWidthRef.current,
          // overflow: "hidden",
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
});

export default PDFViewer;
