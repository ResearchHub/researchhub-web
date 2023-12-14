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

  // Store destinations for internal links (e.g. anchors)
  const internalLinkDestinations = useRef({});
  // Used to specify a target page that we should scroll to
  const [scrollTarget, setScrollTarget] = useState<{
    page: number;
    x?: number;
    y?: number;
  } | null>(null);

  useEffect(() => {
    // If there is a scrollTarget, scroll to it.
    // We do scrolling because we have existing logic to load additional pages
    // when we scroll to the bottom of the page.
    if (!scrollTarget) return;

    const { page } = scrollTarget;

    if (page !== undefined && !renderedPages[page]) {
      // Scroll to the bottom of the last rendered page
      const lastPageRendered = Object.keys(renderedPages).length;
      if (lastPageRendered < page) {
        renderedPages[lastPageRendered]?.pageContainer.scrollIntoView({
          behavior: "smooth",
        });
      } else if (lastPageRendered === page) {
        // Target page is now rendered, perform scrolling logic
        const pageContainer = renderedPages[page]?.pageContainer;
        pageContainer.scrollIntoView({ behavior: "smooth" });

        // Reset scrollTarget
        setScrollTarget(null);
      }
    } else {
      // Target page is already rendered, perform your scrolling logic
      const pageContainer = renderedPages[page]?.pageContainer;
      pageContainer.scrollIntoView({ behavior: "smooth" });

      // Reset scrollTarget
      setScrollTarget(null);
    }
  }, [renderedPages, scrollTarget]);

  const navigateToDestination = useCallback(
    async (destination) => {
      if (destination === null || destination === undefined) return;

      if (typeof destination === "number") {
        // Simple case: destination is a page number
        const targetPageNumber = destination;
        if (targetPageNumber >= 1 && targetPageNumber <= numPages) {
          // Logic to scroll to the top of the target page
          const pageToScroll = renderedPages[targetPageNumber].pageContainer;
          if (pageToScroll) {
            pageToScroll.scrollIntoView({ behavior: "smooth" });
          } else {
            // We haven't rendered the target page yet, so we need to load it.
            // Set is as the scroll target so we can iteratively scroll to it.
            setScrollTarget({
              page: targetPageNumber,
            });
          }
        }
      } else if (Array.isArray(destination)) {
        // desitation is an array of page/coordinate details.
        // e.g. [ { num: 1, gen: 0 }, { name: 'XYZ' }, 0, 841.89, null ]
        const objectNumber = destination[0].num;
        const generationNumber = destination[0].gen;
        try {
          const pageNumber =
            (await pdfDocument.getPageIndex({
              num: objectNumber,
              gen: generationNumber,
            })) + 1; // getPageIndex is zero-based
          if (pageNumber >= 1 && pageNumber <= numPages) {
            const pageContainer = renderedPages[pageNumber]?.pageContainer;
            if (pageContainer) {
              pageContainer.scrollIntoView({ behavior: "smooth" });
            } else {
              // We haven't rendered the target page yet, so we need to load it.
              // Set is as the scroll target so we can iteratively scroll to it.
              setScrollTarget({
                page: pageNumber,
              });
            }
          }
        } catch (error) {
          console.log("error navigating to destination", error);
        }
      } else {
        // it's a named destination that we need to look up in the document
        navigateToNamedDestination(destination);
      }
    },
    [numPages, renderedPages]
  );

  const navigateToNamedDestination = useCallback(
    async (namedDestination) => {
      try {
        const resolvedDestination = await pdfDocument.getDestination(
          namedDestination
        );
        if (resolvedDestination) {
          // resolvedDestination is an array of page/coordinate details.
          // e.g. [ { num: 1, gen: 0 }, { name: 'XYZ' }, 0, 841.89, null ]
          // So we can handle it in navigateToDestination
          navigateToDestination(resolvedDestination);
        }
      } catch (error) {
        console.log("error navigating to named destination", error);
      }
    },
    [pdfDocument, navigateToDestination]
  );

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

      // Setup links to internal destinations (e.g. link to a specific citation or figure/table)
      const annotations = await page.getAnnotations();
      const internalLinks = annotations.filter(
        (ann) => ann.subtype === "Link" && ann.url === undefined
      );
      internalLinks.forEach((link, index) => {
        const destination = link.dest; // 'dest' is the PDF.js property for internal destinations
        internalLinkDestinations.current[
          `internal-link-${pageNumber}-${index}`
        ] = destination;
      });

      const pageDiv = pageContainer.querySelector(".page") as HTMLDivElement;
      const annotationsDiv = pageContainer.querySelector(
        ".annotationLayer"
      ) as HTMLDivElement;

      if (pageDiv) pageDiv.style.margin = "0 auto";
      if (annotationsDiv) {
        // if we wanted to hide annotations, we'd set display to "none"
        annotationsDiv.style.display = "block";
        // we unset left, since the default is 0 but that results in annotations
        // being rendered further to the left than the page content.
        annotationsDiv.style.left = "unset";

        // Setup internal and external links
        const links = annotationsDiv.getElementsByTagName("a");
        for (let index = 0; index < links.length; index++) {
          const link = links[index];
          if (link.href === "#" || link.href.endsWith("#")) {
            // it's an internal link, so we want to setup custom scrolling to whatever anchor it's pointing to
            const linkKey = `internal-link-${pageNumber}-${index}`;
            link.addEventListener("click", (event) => {
              event.preventDefault();
              const destination = internalLinkDestinations.current[linkKey];
              navigateToDestination(destination);
            });
          } else {
            // it's an external link, so we want to open it in a new tab
            link.target = "_blank";
          }
        }
      }

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
