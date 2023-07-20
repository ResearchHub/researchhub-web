import { useEffect, useState } from "react";
import XRange from "./xrange/XRange";
import {
  isSelectionInsideElement,
  selectionContainsDisallowedElements,
} from "./selection";

export type Selection = {
  // XRange representation of the current selection. Contains xpath and offset information.
  xrange: null | any;

  // This represents the position near the top of the selection. Useful if multiple rows of text are selected
  initialSelectionPosition: null | { x: number; y: number };

  // Represents mouse coordinates of selected text relative to the contentRef element.
  mouseCoordinates: null | { x: number; y: number };

  // Utility function to reset selection
  resetSelectedPos: Function;
  error: string | null;

  // Mainly useful for PDFs since they are broken into pages. For posts, this value will always be 0
  pageNumber: number;
};

const useSelection = ({ contentRef }): Selection => {
  const _resetSelectedPos = () => {
    setSelection({
      xrange: null,
      initialSelectionPosition: null,
      mouseCoordinates: null,
      resetSelectedPos: _resetSelectedPos,
      error: null,
      pageNumber: 0,
    });
  };

  const [selection, setSelection] = useState<Selection>({
    xrange: null,
    initialSelectionPosition: null,
    mouseCoordinates: null,
    resetSelectedPos: _resetSelectedPos,
    error: null,
    pageNumber: 0,
  });

  useEffect(() => {
    const handleSelection = (e) => {
      // setTimeout 0 is required to ensure synchronicity between selection object and click events. Without it,
      // the state of getSelection may not be accurate. It essentially ensure click finishes before selection object is obtained.
      setTimeout(() => {
        const _selection: Selection = {
          xrange: undefined,
          initialSelectionPosition: null,
          mouseCoordinates: null,
          resetSelectedPos: _resetSelectedPos,
          error: null,
          pageNumber: 0,
        };

        const selection = window.getSelection();
        const isDisallowedSelected = selectionContainsDisallowedElements({
          selection,
          disallowedTags: ["img", "video", "figure", "table"],
        });

        if (isDisallowedSelected) {
          _selection.error = "Please select text only";
        }

        const isValidSelection =
          selection &&
          selection.rangeCount > 0 &&
          !selection.isCollapsed &&
          selection.toString().trim() !== "" &&
          isSelectionInsideElement({ element: contentRef.current, selection });

        if (isValidSelection) {
          const newRange = XRange.createFromSelection();
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const position = { x: rect.x, y: rect.y };
          const contentRect = contentRef.current.getBoundingClientRect();

          _selection.initialSelectionPosition = position;
          _selection.xrange = newRange;
          _selection.mouseCoordinates = {
            x: rect.x - contentRect.x + rect.width / 2,
            y: rect.y - contentRect.y - 45,
          };

          try {
            _selection.pageNumber = parseInt(
              e.target.closest(".react-pdf__Page").attributes[
                "data-page-number"
              ].value
            );
          } catch (error) {
            _selection.pageNumber = 0;
          }
        }

        setSelection(_selection);
      }, 0);
    };

    document.addEventListener("click", handleSelection);

    return () => {
      document.removeEventListener("click", handleSelection);
    };
  }, [contentRef]);

  return selection;
};

export default useSelection;
