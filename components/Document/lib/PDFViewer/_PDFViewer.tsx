import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist/build/pdf';
import { PDFPageView, EventBus, TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

interface Props {
  pdfUrl: string | undefined,
  showWhenLoading: null | React.ReactNode,
  scale: number,
}

function PdfViewer({ pdfUrl, showWhenLoading = null, scale = 1.0 }: Props) {
  const containerRef = useRef();
  const [isReady, setIsReady] = useState<boolean>(false); 
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [nextPage, setNextPage] = useState<number>(1); 
  const [pagesLoaded, setPagesLoaded] = useState<number[]>([]);
  const [pagesLoading, setPagesLoading] = useState<number[]>([]);
  const observer = useRef(null); 
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

      if (!isReady) setIsReady(true);
      
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
      const loadingTask = getDocument(pdfUrl);
      const pdfDocument = await loadingTask.promise;
      setPdfDocument(pdfDocument);
      setNumPages(pdfDocument.numPages);
    };

    loadDocument();
  }, [pdfUrl]);

  useEffect(() => {
    if (pdfDocument && nextPage <= numPages) {
      loadPage(nextPage);
    }
  }, [nextPage, loadPage, pdfDocument, numPages]); 

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef} style={{ overflow: "hidden" }}></div>
      {(pagesLoading.length > 0 || !isReady) && showWhenLoading}
    </div>
  );
}

export default PdfViewer;
