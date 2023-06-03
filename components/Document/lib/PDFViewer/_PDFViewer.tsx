import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist/build/pdf';
import { PDFPageView, EventBus, TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
} from "@fortawesome/pro-light-svg-icons";
import { StyleSheet, css } from "aphrodite";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

interface Props {
  pdfUrl: string | undefined,
  showWhenLoading: null | React.ReactNode,
  scale: number,
  onLoadSuccess?: Function,
  onLoadError?: Function,
}

function PdfViewer({ pdfUrl, showWhenLoading = null, scale = 1.0, onLoadSuccess, onLoadError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState<boolean>(false); 
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [nextPage, setNextPage] = useState<number>(1); 
  const [pagesLoaded, setPagesLoaded] = useState<number[]>([]);
  const [pagesLoading, setPagesLoading] = useState<number[]>([]);
  const observer = useRef<HTMLDivElement>(null); 
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);
  const eventBus = new EventBus();

  const loadPage = useCallback(async (pageNum) => {
    const isAlreadyLoadingOrLoaded = pagesLoading.includes(pageNum) || pagesLoaded.includes(pageNum);

    if (pdfDocument && pageNum <= numPages && !isAlreadyLoadingOrLoaded) {
      setPagesLoading([...pagesLoading, pageNum]);

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

      if (!isReady) {
        setIsReady(true);
        onLoadSuccess && onLoadSuccess();
      }
      
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pageNum < numPages) {
          setNextPage(pageNum + 1);
        }
      }, {
        rootMargin: "0px 0px -100% 0px"
      });
      observer.current.observe(pageContainer);

      setPagesLoaded([...pagesLoaded, pageNum]);
      setPagesLoading(pagesLoading.filter((page) => page !== pageNum));      
    }
  }, [pdfDocument, numPages, scale, eventBus]);

  useEffect(() => {
    const loadDocument = async () => {
      let pdfDocument;
      try {
        const loadingTask = getDocument(pdfUrl);
        pdfDocument = await loadingTask.promise;
        setPdfDocument(pdfDocument);
        setNumPages(pdfDocument.numPages);
      }
      catch(error) {
        onLoadError && onLoadError(error);
        setHasLoadError(true);
        console.log('error loading pdf', error)
      }
    };

    loadDocument();
  }, [pdfUrl]);

  useEffect(() => {
    if (pdfDocument && nextPage <= numPages) {
      loadPage(nextPage);
    }
  }, [nextPage, loadPage, pdfDocument, numPages]); 

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
    <div style={{ position: "relative" }}>
      <div ref={containerRef} style={{ overflow: "hidden" }}></div>
      {(pagesLoading.length > 0 || !isReady) && showWhenLoading}
    </div>
  );
}

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
})

export default PdfViewer;
