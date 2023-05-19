import { Document, Outline, Page, pdfjs } from "react-pdf";
import { useCallback, useEffect, useRef, useState } from "react";
import config from "./lib/config";
import { StyleSheet, css } from "aphrodite";
import debounce from "lodash.debounce";
import DocumentPlaceholder from "./DocumentPlaceholder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/pro-light-svg-icons";

// FIXME: Replace with local worker.
// Needs to set up a custom webpack config to do this.
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


interface Props {
  pdfUrl?: string;
  maxWidth?: number;
}

const PDFViewer = ({ pdfUrl, maxWidth = 900 }: Props) => {
  const [numPages, setNumPages] = useState<null | number>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [viewerWidth, setViewerWidth] = useState<number>(maxWidth); // PDFJS needs explicit width to render properly
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [pagesRendered, setPagesRendered] = useState<number>(1); // Start by rendering one page
  const observer = useRef(null); // Observe the last rendered page to see if it's in view, if not, load more pages
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasLoadError, setHasLoadError] = useState<boolean>(false);

  useEffect(() => {
    function keydownHandler(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }

    document.addEventListener("keydown", keydownHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  useEffect(() => {
    function resizeHandler() {
      setViewerWidth(Math.min(maxWidth, window.outerWidth));
    }

    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError() {
    setIsLoading(false);
    setHasLoadError(true);
  }


  const lastPageRef = useCallback(
    (node: HTMLDivElement | null) => {
      // @ts-ignore
      if (observer.current) observer.current.disconnect();
      // @ts-ignore
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagesRendered < (numPages ?? 0)) {
          console.log("load more pages");
          setPagesRendered((prev) => prev + 1);
        }
      });
      // @ts-ignore
      if (node) observer.current.observe(node);
    },
    [pagesRendered, numPages]
  );

  // function onItemClick({ pageNumber: itemPageNumber }) {
  //   setPageNumber(itemPageNumber);
  // }

  function highlightPattern(text, pattern) {
    const words = pattern.split(" ");
    const regexPattern = words.join("|");
    const regex = new RegExp(regexPattern, "gi");
    return text.replace(regex, (value) => `<mark>${value}</mark>`);
  }

  const textRenderer = useCallback(
    (textItem) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  const handleInputChange = useCallback(async () => {
    setSearchText(inputRef?.current?.value || "");
  }, []);

  const debouncedHandleSearchInputChange = useCallback(
    debounce(handleInputChange, 500),
    [handleInputChange]
  );

  if (hasLoadError) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", rowGap: "15px", justifyContent: "center", marginTop: "30%" }}>
          <FontAwesomeIcon icon={faCircleExclamation} style={{fontSize: 44}} />
          <span style={{ fontSize: 22}}>There was an error loading the PDF.</span>
        </div>
    )
  }

  return (
    <div className={css(styles.container)}>
      {isLoading ? <DocumentPlaceholder /> : null}
      <div>
        <label htmlFor="search">Search:</label>
        <input
          ref={inputRef}
          type="search"
          id="search"
          onChange={debouncedHandleSearchInputChange}
        />
      </div>


      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
      >
        {/* <Outline onItemClick={onItemClick} /> */}
        {/* <Page key={`page_1`} pageNumber={1} customTextRenderer={textRenderer} onLoadSuccess={removeTextLayerOffset} width={900}/> */}
        {/* <button onClick={() => {
          alert(isExpanded)
          setIsExpanded(!isExpanded);
        }}>Expand</button> */}

        {Array.from(new Array(pagesRendered), (el, index) => (
          <div
            ref={index + 1 === pagesRendered ? lastPageRef : null}
            key={`page_${index + 1}`}
          >
            <Page
              pageNumber={index + 1}
              width={viewerWidth}
              customTextRenderer={textRenderer}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};



const styles = StyleSheet.create({
  container: {

  },
});

export default PDFViewer;
