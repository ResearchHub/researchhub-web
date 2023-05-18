import { Document, Outline, Page, pdfjs } from "react-pdf";
import { useCallback, useEffect, useRef, useState } from "react";
import config from "./lib/config";
import { StyleSheet, css } from "aphrodite";
import debounce from "lodash.debounce";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  pdfUrl?: string;
}

const PDFViewer = ({ pdfUrl }: Props) => {
  const [numPages, setNumPages] = useState(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const [searchText, setSearchText] = useState("");

  function removeTextLayerOffset() {
    const textLayers = document.querySelectorAll(
      ".react-pdf__Page__textContent"
    );
    textLayers.forEach((layer) => {
      const { style } = layer;
      style.top = "0";
      style.left = "0";
      style.transform = "";
    });
  }

  // const [elWidth, setElWidth] = useState<number>(0);
  // const elRef = useRef(null);

  // useEffect(() => {

  //   const _setSize = () => {
  //     setElWidth(elRef.current.clientWidth);
  //     console.log('elWidth', elWidth)
  //   }

  //   const _handleResize = () => {
  //     if (!elRef.current) return;
  //     _setSize();
  //   }

  //   _setSize();

  //   window.addEventListener("resize", _handleResize);

  //   return () => {
  //     window.removeEventListener("resize", _handleResize);
  //   }
  // }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const [pagesRendered, setPagesRendered] = useState(1); // Start by rendering one page
  const observer = useRef(null);

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
    console.log("input has changed", searchText);
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
      <Document
        file={
          "https://researchhub-paper-dev1.s3.amazonaws.com/uploads/papers/2021/08/25/2020.11.16.385385v1.pdf?AWSAccessKeyId=AKIA3RZN3OVNNBYLSFM3&Signature=MV7YhVlcApr5Vj%2FoZem%2FHKiP%2B%2BE%3D&Expires=1684956823"
        }
        onLoadSuccess={onDocumentLoadSuccess}
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
              width={900}
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
