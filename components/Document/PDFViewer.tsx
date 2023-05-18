import { Document, Outline, Page, pdfjs } from "react-pdf";
import { useCallback, useEffect, useRef, useState } from "react";
import config from "./lib/config";
import { StyleSheet, css } from "aphrodite";
import debounce from "lodash.debounce";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  pdfUrl?: string;
  maxWidth?: number;
}

const PDFViewer = ({ pdfUrl, maxWidth = 900 }: Props) => {
  const [numPages, setNumPages] = useState(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [viewerWidth, setViewerWidth] = useState<number>(maxWidth); // PDFJS needs explicit width to render properly
  const [isExpanded, setIsExpanded] = useState(false);
  const [pagesRendered, setPagesRendered] = useState(1); // Start by rendering one page
  const observer = useRef(null); // Observe the last rendered page to see if it's in view, if not, load more pages
  const [searchText, setSearchText] = useState("");
  
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
  }  


  const lastPageRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagesRendered < numPages) {
          console.log("load more pages");
          setPagesRendered((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [pagesRendered, numPages]
  );

  function onItemClick({ pageNumber: itemPageNumber }) {
    setPageNumber(itemPageNumber);
  }

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

  return (
    <div className={css(styles.container)}>
      <div>
        <label htmlFor="search">Search:</label>
        <input
          ref={inputRef}
          type="search"
          id="search"
          onChange={debouncedHandleSearchInputChange}
        />
      </div>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
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
    borderRadius: "4px",
    border: `1px solid ${config.border}`,
    marginTop: 15,
    minHeight: 1500,
    background: "white",
  },
});

export default PDFViewer;
