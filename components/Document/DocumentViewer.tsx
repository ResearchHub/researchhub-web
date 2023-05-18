import { Document, Outline, Page, pdfjs } from 'react-pdf';
import { useCallback, useEffect, useRef, useState } from 'react';
import config from "./lib/config";
import { GenericDocument } from "./lib/types";
import { StyleSheet, css } from "aphrodite";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  document: GenericDocument;
}

function highlightPattern(text, pattern) {
  return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}


const DocumentViewer = ({ document:doc }: Props) => {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const [searchText, setSearchText] = useState('');

  const textRenderer = useCallback(
    (textItem) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  function removeTextLayerOffset() {
    const textLayers = document.querySelectorAll(".react-pdf__Page__textContent");
      textLayers.forEach(layer => {
        const { style } = layer;
        style.top = "0";
        style.left = "0";
        style.transform = "";
    });
  }

  function onChange(event) {
    setSearchText(event.target.value);
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

  
  const lastPageRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagesRendered < numPages) {
        console.log('load more pages')
        setPagesRendered(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [pagesRendered, numPages]);



  function onItemClick({ pageNumber: itemPageNumber }) {
    setPageNumber(itemPageNumber);
  }

  
  return (
    <div className={css(styles.container)}>
      <div>
        <label htmlFor="search">Search:</label>
        <input type="search" id="search" value={searchText} onChange={onChange} />
      </div>
      <Document
        file={"https://researchhub-paper-dev1.s3.amazonaws.com/uploads/papers/2021/08/25/2020.11.16.385385v1.pdf?AWSAccessKeyId=AKIA3RZN3OVNNBYLSFM3&Signature=MV7YhVlcApr5Vj%2FoZem%2FHKiP%2B%2BE%3D&Expires=1684956823"}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {/* <Outline onItemClick={onItemClick} /> */}
        {/* <Page key={`page_1`} pageNumber={1} customTextRenderer={textRenderer} onLoadSuccess={removeTextLayerOffset} width={900}/> */}
        <button onClick={() => {
          alert(isExpanded)
          setIsExpanded(!isExpanded);
        }}>Expand</button>
        {Array.from(
          new Array(pagesRendered),
          (el, index) => (
            <div ref={index + 1 === pagesRendered ? lastPageRef : null} key={`page_${index + 1}`}>
              <Page pageNumber={index + 1} width={900} />
            </div>
          ),
        )}
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

export default DocumentViewer;






